const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { dialog } = require('electron')


// BackendProcess runs the qri backend binary in connected'ed mode, to handle api requests.
class BackendProcess {
  constructor () {
    this.qriBinPath = null
    this.process = null
    this.debugLogPath = null;

    // Default to writing to stdout & stderr
    this.out = process.stdout
    this.err = process.stderr
    try {
      // Create a log whose filename contains the current day.
      const nowTime = new Date();
      const nowString = nowTime.toISOString();
      const filename = 'qri_' + nowString.substring(0, nowString.indexOf('T')) + '.log';

      // Log to this file in a temporary directory named after our app
      const dirPath = path.join(os.tmpdir(), 'io.qri.desktop')
      const logPath = path.join(dirPath, filename)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      console.log('Logging to ' + logPath);
      this.debugLogPath = logPath;

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
  }

  maybeStartup () {
    // In development node, use installed qri binary
    if (process.env.NODE_ENV === 'development') {
      let processResult = childProcess.execSync('which qri');
      let whichBin = processResult.toString().trim();
      if (fs.existsSync(whichBin)) {
        this.qriBinPath = whichBin;
      }
    }
    // Locate the binary for the qri backend command-line in common paths
    if (!this.qriBinPath) {
      this.qriBinPath = this.findQriBin([process.resourcesPath, path.join(__dirname, '../')])
    }
    if (!this.qriBinPath) {
      return
    }
    // Run the binary if it is found
    console.log('Found qri binary at path ' + this.qriBinPath);
    this.launchProcess()
  }

  close () {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  launchProcess () {
    try {
      let processResult = childProcess.execSync(this.qriBinPath + ' version')
      let qriBinVersion = processResult.toString().trim();
      this.process = childProcess.spawn(this.qriBinPath, ['connect', '--setup'], { stdio: ['ignore', this.out, this.err] })
      this.process.on('error', (err) => { this.handleEvent('error', err) })
      this.process.on('exit', (err) => { this.handleEvent('exit', err) })
      this.process.on('close', (err) => { this.handleEvent('close', err) })
      this.process.on('disconnect', (err) => { this.handleEvent('disconnect', err) })
      console.log('starting up qri backend version ' + qriBinVersion)
    } catch (err) {
      console.log('ERROR, Starting background process: ' + err)
    }
  }

  handleEvent (kind, err) {
    if (err) {
      console.log('event ' + kind + ' from backend: ' + err)
    } else {
      console.log('event ' + kind + ' from backend')
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
