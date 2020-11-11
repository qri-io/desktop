const log = require('electron-log')
const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')
const http = require('http')
const fkill = require('fkill')
const { dialog } = require('electron')
const findProcess = require('find-process')

const { backendVersion: expectedBackendVer } = require('../version')

const { BACKEND_PORT } = require('./constants')

const errPortOccupied = new Error('port-occupied')

// BackendProcess runs the qri backend binary in connected'ed mode, to handle api requests.
class BackendProcess {
  constructor () {
    this.qriBinPath = null
    this.process = null
    this.debugLogPath = null
    this.backendVer = null

    // Default to writing to stdout & stderr
    this.out = process.stdout
    this.in = process.in
    this.err = process.stderr;

    [
      'setQriBinPath',
      'setBackendVer',
      'standardRepoPath',
      'checkNoActiveBackendProcess',
      'checkBackendCompatibility',
      'checkNeedsMigration',
      'launchProcess'
    ].forEach((m) => { this[m] = this[m].bind(this) })

    try {
      // Create a log whose filename contains the current day.
      const nowTime = new Date()
      const nowString = nowTime.toISOString()
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
  }

  // running this function will ensure that a qriBinPath exists
  setQriBinPath () {
    // In development node, use installed qri binary
    if (process.env.NODE_ENV === 'development') {
      try {
        let processResult = childProcess.execSync('which qri')
        let whichBin = processResult.toString().trim()
        if (fs.existsSync(whichBin)) {
          this.qriBinPath = whichBin
          log.info(`because we're in dev mode, looking for qri binary on $PATH. found: ${this.qriBinPath}`)
        }
      } catch (e) {
        log.info('unable to find the qri binary on your $PATH. Does running `which qri` in your terminal give you any output?')
      }
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

  close () {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  standardRepoPath () {
    var qriRepoPath = process.env.QRI_PATH
    if (qriRepoPath === "") {
      home = os.homedir()
      qriRepoPath = path.join(home, ".qri")
    }

    log.info(`QRI_PATH is ${qriRepoPath}`)
    return qriRepoPath
  }

  async checkNoActiveBackendProcess () {
    log.info("checking for active backend process")

    let errorCheckingPort = false
    const list = await findProcess('port', BACKEND_PORT)
                        .catch(e => {
                          log.info(`error examining port ${BACKEND_PORT}: ${e}. pinging health endpoint for a response...`)
                          errorCheckingPort = true
                        })

    if (!errorCheckingPort) {
      if (list.length === 0) {
        // port is clear
        return
      }

      list.forEach(process => {
        if (!process.cmd.includes('qri connect')) {
          /**
           * if the process at the port is not a qri process, throw an error
           */
          throw errPortOccupied
        }
      })
    }

    const healthResponse = async () => {
      return new Promise((resolve) => {
        http.get(`http://localhost:${BACKEND_PORT}/health`, (res) => {
          if ( errorCheckingPort && res.statusCode !== 200 ) {
            /**
             * if we do not have a successful status code AND we were not able
             * to confirm that a qri process is running at the given port, we should
             * warn the user & have them close the process on their own, or reach
             * out to us for help.
             */
            throw errPortOccupied
          }
          let body = ''
          res.on('data', (chunk) => {
            body += chunk
          })
          res.on('end', () => {
            resolve(body)
          })
        }).on('error', (e) => {
          resolve(null)
        })
      })
    }

    const body = await healthResponse()

    if (body === null) {
      /** if the body is null, then we don't have a backend running and so
       * we can just proceed as normal. We should very rarely reach this state
       * as we have already tested if something is running at the given port
       */
      return
    }

    let parsedBody
    try {
      parsedBody = JSON.parse(body)
    } catch (e) {
      log.info(`error parsing health response from process running at ${BACKEND_PORT}: ${e}`)
    }

    if (parsedBody && parsedBody.meta && parsedBody.meta.version && parsedBody.meta.version === expectedBackendVer) {
      /**
       * if the response version is equal to our expected version then we already
       * have a backend running, and we need to throw the error
       */
      throw new Error("backend-already-running")
    }

    /**
     * if we make it here it means we were able to get a response from the 
     * backend, but that response either didn't parse or the backend version was 
     * not compatible
     * in either case, we need to kill the process that is running on that port
     * since it is not playing nicely
     */
    log.info(`qri process currently running at port ${BACKEND_PORT} is incompatible with this version of Qri Desktop. Killing the process...`)
    await fkill(`:${BACKEND_PORT}`)
  }

  async checkBackendCompatibility () {
    log.info(`checking to see if given backend version ${this.backendVer} is compatible with expected version ${expectedBackendVer}`)
    let compatible = false
    try {
      let ver = this.backendVer
      let expVer = expectedBackendVer

      // if folks are using dev versions, then we should assume they know what they are
      // doing, and not auto-error that the backend is incompatible.
      if (this.backendVer.indexOf("-dev") !== -1) {
        ver = ver.slice(0, this.backendVer.indexOf("-dev"))
      }
      if (expectedBackendVer.indexOf("-dev") !== -1) {
        expVer = expVer.slice(0, expectedBackendVer.indexOf("-dev"))
      }
      if (expVer == ver) {
        compatible = true
      }
    } catch (e) {
      throw e
    }
    if (!compatible) {
      throw new Error("incompatible-backend")
    }
  }

  launchProcess () {
    try {
      this.process = childProcess.spawn(this.qriBinPath, ['connect', '--migrate', '--log-all', '--setup', '--no-prompt'], { stdio: ['ignore', this.out, this.err] })
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

  checkNeedsMigration () {
    log.info("checking for backend migrations")
    try {
      childProcess.execSync(`"${this.qriBinPath}" config get`)
    } catch (err) {
      // status code 2 means we need to run a migration
      if (err.status == 2) {
        return true
      }
      log.error(`error checking for migration: ${err}`)
    }
    return false
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
