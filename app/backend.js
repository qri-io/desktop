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

    if (process.env.NODE_ENV === 'development') {
      // if we're in dev mode write to this process
      this.out = process.stdout
      this.err = process.stderr
    } else {
      try {
        const dirPath = path.join(os.tmpdir(), 'io.qri.desktop')
        const logPath = path.join(dirPath, 'qri.log')
        
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath)
        }
        this.out = fs.openSync(logPath, 'a')
        this.err = fs.openSync(logPath, 'a')
      } catch (err) {
        dialog.showMessageBox({
          type: 'error',
          title: 'error setting up backend logging',
          message: 'We couldn\'t configure the backend to log to a temporary directory. \nThis might not be a big deal, but it also may be a sign of problems with qri interacting with your filesystem',
          detail: err
        })
        // fall back to writing to stdout & stderr
        this.out = process.stdout
        this.err = process.stderr
      }
    }
  }

  maybeStartup () {
    // Locate the binary for the qri backend command-line
    this.qriBinPath = this.findQriBin([process.resourcesPath, path.join(__dirname, '../')])
    if (!this.qriBinPath) {
      return
    }
    // Run the binary if it is found
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
      this.process = childProcess.spawn(this.qriBinPath, ['connect', '--setup'], { stdio: ['ignore', this.out, this.err] })
      this.process.on('error', (err) => { this.handleEvent('error', err) })
      this.process.on('exit', (err) => { this.handleEvent('exit', err) })
      this.process.on('close', (err) => { this.handleEvent('close', err) })
      this.process.on('disconnect', (err) => { this.handleEvent('disconnect', err) })
      console.log('launched backend')
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
