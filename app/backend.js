const log = require('electron-log')
const childProcess = require('child_process')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const os = require('os')
const http = require('http')
const { dialog } = require('electron')

var lowestCompatibleBackend = [0, 9, 9]
var lowestCompatibleConfigRevision = 2

// BackendProcess runs the qri backend binary in connected'ed mode, to handle api requests.
class BackendProcess {
  constructor () {
    this.qriBinPath = null
    this.process = null
    this.debugLogPath = null
    this.backendVer = null
    this.configRev = null

    // Default to writing to stdout & stderr
    this.out = process.stdout
    this.in = process.in
    this.err = process.stderr;

    [
      'setQriBinPath',
      'setBackendVer',
      'setConfigRev',
      'standardRepoPath',
      'checkNoActiveBackendProcess',
      'checkBackendCompatibility',
      'checkNeedsMigration',
      'launchProcess'
    ].forEach((m) => { this[m] = this[m].bind(this) })


    try {
      // Create a log whose filename contains the current day.
      const nowTime = new Date();
      const nowString = nowTime.toISOString();
      const filename = `qri_${nowString.substring(0, nowString.indexOf('T'))}.log`

      // Log to this file in a temporary directory named after our app
      const dirPath = path.join(os.tmpdir(), 'io.qri.desktop')
      const logPath = path.join(dirPath, filename)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      log.info(`logging backend output to ${logPath}`)
      this.debugLogPath = logPath

      this.out = fs.openSync(logPath, 'a')
      this.err = fs.openSync(logPath, 'a')
    } catch (err) {
      dialog.showMessageBox({
        type: 'error',
        title: 'error setting up backend logging',
        message: 'We couldn\'t configure the backend to log to a temporary directory. \nThis might not be a big deal, but it also may be a sign of problems with qri interacting with your filesystem',
        detail: err
      })
    }
    this.setQriBinPath()
    this.setBackendVer()
    this.setConfigRev()
  }

  // running this function will ensure that a qriBinPath exists
  setQriBinPath () {
    // In development node, use installed qri binary
    if (process.env.NODE_ENV === 'development') {
      let processResult = childProcess.execSync('which qri');
      let whichBin = processResult.toString().trim();
      if (fs.existsSync(whichBin)) {
        this.qriBinPath = whichBin;
      }
      log.info(`because we're in dev mode, looking for qri binary on $PATH. found: ${this.qriBinPath}`)
    }
    // Locate the binary for the qri backend command-line in common paths
    if (!this.qriBinPath) {
      this.qriBinPath = this.findQriBin([process.resourcesPath, path.join(__dirname, '../')])
    }

    if (!this.qriBinPath) {
      log.warn('no qri bin path found, backend launch failed')
      throw new Error("no qri bin path found, backend launch failed")
    }
    log.info(`found qri binary at path: ${this.qriBinPath}`)
  }

  setBackendVer () {
    let processResult = childProcess.execSync(`"${this.qriBinPath}" version`)
    this.backendVer = processResult.toString().trim()
    log.info("qri backend version", this.backendVer)

  }

  setConfigRev () {
    var qriRepoPath = this.standardRepoPath()
    var configPath = path.join(qriRepoPath, "config.yaml")
    log.info(`path to config: ${configPath}`)
    try {
      let fileContents = fs.readFileSync(configPath, 'utf8');
      let config = yaml.safeLoad(fileContents);
      this.configRev = config.Revision
    } catch (e) {
      log.error(`error getting config revision: ${e}`)
      throw e
    }
  }

  close () {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  standardRepoPath() {
    var qriRepoPath = process.env.QRI_PATH
    if (qriRepoPath === "") {
      home = os.homedir()
      qriRepoPath = path.join(home, ".qri")
    }
    
    log.info(`QRI_PATH is ${qriRepoPath}`)
    return qriRepoPath
  }

  async checkNoActiveBackendProcess() {
    const healthCheck = async () => {
      return new Promise((res, rej) => {
        http.get('http://localhost:2503/health', (data) => {
          res(true)
        }).on('error', (e) => {
          res(false)
        })
      })
    }

    var isQriRunning = await healthCheck()
    if (isQriRunning) {
      throw new Error("backend-already-running")
    }
    return
  }

  async checkBackendCompatibility () {
    log.info(`checking to see if given backend version ${this.backendVer} is compatible with expected version ${lowestCompatibleBackend.join(".")}`)
    let compatible = false
    try {
      let ver = this.backendVer
      if (this.backendVer.indexOf("-dev") !== -1) {
        ver = ver.slice(0, this.backendVer.indexOf("-dev"))
      }
      ver = ver.split(".").map((i) => parseInt(i))
      compatible = lowestCompatibleBackend.every((val, i) => {
        if (val <= ver[i]) {
          return true
        }
        return false
      })
    } catch (e) {
      throw e
    }
    if (!compatible) {
      throw new Error("incompatible-backend")
    }
  }

  launchProcess () {
    try {
      this.process = childProcess.spawn(this.qriBinPath, ['connect', '--migrate', '--log-all'], { stdio: ['ignore', this.out, this.err] })
      this.process.on('error', (err) => { this.handleEvent('error', err) })
      this.process.on('exit', (err) => { this.handleEvent('exit', err) })
      this.process.on('close', (err) => { this.handleEvent('close', err) })
      this.process.on('disconnect', (err) => { this.handleEvent('disconnect', err) })
      log.info(`starting up qri backend version ${this.backendVer}`)
    } catch (err) {
      log.error(`starting background process: ${err}`)
    }
  }

  handleEvent (kind, err) {
    if (err) {
      log.error(`event ${kind} from backend: ${err}`)
      throw err
    } else {
      log.warn(`event ${kind} from backend`)
    }
  }

  checkNeedsMigration() {
    try {
      if (lowestCompatibleConfigRevision <= this.configRev) {
        log.info(`config revisions are compatible`)
        return false
      }
      log.info(`given config revision ${this.configRev} not compatible with expected revision ${lowestCompatibleConfigRevision}`)
      return true
    } catch (e) {
        throw e
    }
  }

  findQriBin (pathList) {
    for (let i = 0; i < pathList.length; i++) {
      let binPath = path.join(pathList[i], '/backend/qri')
      if (fs.existsSync(binPath)) {
        return binPath
      }
      binPath += '.exe'
      if (fs.existsSync(binPath)) {
        return binPath
      }
    }
    return null
  }
}

module.exports.BackendProcess = BackendProcess
