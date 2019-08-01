const child_process = require('child_process');
const fs = require('fs');
const path = require('path'); // eslint-disable-line

// BackendProcess runs the qri backend binary in connected'ed mode, to handle api requests.
class BackendProcess {
  constructor() {
    this.qriBinPath = null
    this.process = null
  }

  maybeStartup() {
    // Locate the binary for the qri backend command-line
    this.qriBinPath = this.findQriBin([process.resourcesPath, path.join(__dirname, '../')])
    if (!this.qriBinPath) {
      return
    }
    // Run the binary if it is found
    this.launchProcess()
  }

  close() {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  launchProcess() {
    try {
      this.process = child_process.spawn(this.qriBinPath, ['connect'], {})
      this.process.on('error', (err) => { this.handleEvent('error', err)})
      this.process.on('exit', (err) => { this.handleEvent('exit', err)})
      this.process.on('close', (err) => { this.handleEvent('close', err)})
      this.process.on('disconnect', (err) => { this.handleEvent('disconnect', err)})
      console.log('launched backend')
    } catch (err) {
      console.log('ERROR, Starting background process: ' + err)
    }
  }

  handleEvent(kind, err) {
    if (err) {
      console.log('event ' + kind + ' from backend: ' + err)
    } else {
      console.log('event ' + kind + ' from backend')
    }
  }

  findQriBin(pathList) {
    for (let i = 0; i < pathList.length; i++) {
      let binPath = path.join(pathList[i], '/backend/qri')
      if (fs.existsSync(binPath)) {
        return binPath
      }
    }
    return null
  }
}

module.exports.BackendProcess = BackendProcess
