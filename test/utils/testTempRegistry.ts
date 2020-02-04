// globals process
// import os from 'os'
import fs, { WriteStream } from 'fs'
import childProcess from 'child_process'
import path from 'path'
// import rimraf from 'rimraf'

// TestTempRegistry runs the qri backend binary in connected'ed mode,
// configured for isolated testing in a temporary directory
// it expects you've installed a version of qri somewhere on your $PATH
export default class TestTempRegistry {
  registryBinPath: string
  process: any
  dir: string
  stdout: WriteStream
  stderr: WriteStream

  constructor () {
    this.registryBinPath = ''
    this.process = null
    this.dir = ''
  }

  start () {
    // const { resourcesPath = '' } = process
    // Locate the binary for the qri backend command-line
    // this.registryBinPath = this.findTempRegistryBin(['qri', resourcesPath, path.join(__dirname, '../../')])
    this.registryBinPath = this.findTempRegistryBin()
    if (this.registryBinPath === '') {
      throw `couldn't find a qri binary on your $PATH, please install qri backend to run e2e tests`
    }
    // Run the binary if it is found
    console.log(`using registry binary: '${this.registryBinPath}'`)
    this.launchProcess()
  }

  close () {
    // this.teardownRepo()
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  launchProcess () {
    try {
      // const [ base, qriPath, ipfsPath ] = this.setupRepo()

      // this.stdout = fs.createWriteStream(path.join(this.dir, 'stdout.log'))
      // this.stderr = fs.createWriteStream(path.join(this.dir, 'stderr.log'))
      this.process = childProcess.spawn(this.registryBinPath, ['connect', '--setup'], {
        // stdio: ['pipe', this.stdout, this.stderr],
        // env: Object.assign(process.env, {
        //   'QRI_SETUP_CONFIG_DATA': qriConfig,
        //   'QRI_PATH': qriPath,
        //   'IPFS_PATH': ipfsPath
        // })
      })

      // this.process.stdout.pipe(this.stdout);
      // this.process.stderr.pipe(this.stderr);

      this.process.on('error', (err: any) => { this.handleEvent('error', err) })
      this.process.on('exit', () => {  /* noop */ })
      this.process.on('close', (err: any) => { /* noop */ })
      this.process.on('disconnect', (err: any) => { this.handleEvent('disconnect', err) })
    } catch (err) {
      console.log('ERROR, Starting background process: ' + err)
    }
  }

  handleEvent (kind: string, err: Error) {
    if (err) {
      console.log(`err event '${kind}' from registry: ${err}`)
    } else {
      console.log(`event '${kind}' from registry`)
    }
  }

  findTempRegistryBin () {
    const { stdout = '' } = childProcess.spawnSync('which', ['temp_registry_server'])
    let filename = stdout.toString().trim()
    if (fs.existsSync(filename)) {
      return filename
    }
    // In Win32, end the binary with .exe extension.
    filename += '.exe'
    if (fs.existsSync(filename)) {
      return filename
    }
    // In Win32, certain shells need to use Windows-style mount points, instead of cygwin-style.
    filename = filename.replace('/c/', 'c:/')
    if (fs.existsSync(filename)) {
      return filename
    }
    throw 'Could not find temp_registry_server binary'
  }
}
