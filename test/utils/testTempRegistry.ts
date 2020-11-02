// globals process
import fs, { WriteStream } from 'fs'
import path from 'path'
import childProcess from 'child_process'

// TestTempRegistry runs the qri backend binary in connected'ed mode,
// configured for isolated testing in a temporary directory
// it expects you've installed a version of qri somewhere on your $PATH
export default class TestTempRegistry {
  registryBinPath: string
  process: any
  dir: string
  logPath: string
  stdout: WriteStream
  stderr: WriteStream

  constructor () {
    this.registryBinPath = ''
    this.process = null
    this.dir = ''
    this.logPath = path.join(this.dir, 'temp_registry_server.log')
    const write = fs.createWriteStream(this.logPath)
    this.stdout = write
    this.stderr = write
  }

  start () {
    this.registryBinPath = this.findTempRegistryBin()
    if (this.registryBinPath === '') {
      throw `couldn't find a temp_registry_server binary on your $PATH, please install temp_registry_binary to run e2e tests`
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
      this.process = childProcess.spawn(this.registryBinPath, ['connect', '--setup'], {
        env: Object.assign(process.env, {
          'PORT': '2500'
        })
      })

      this.process.stdout.pipe(this.stdout)
      this.process.stderr.pipe(this.stderr)

      this.process.on('error', (err: any) => { this.handleEvent('error', err) })
      this.process.on('exit', () => { this.handleEvent('exit', new Error('registry exited')) })
      this.process.on('close', (err: any) => {
        this.handleEvent('close', err)
        this.stderr.close()
        this.stdout.close()
      })
      this.process.on('disconnect', (err: any) => { this.handleEvent('disconnect', err) })
    } catch (err) {
      console.error(`starting registry process: ${err}`)
    }
  }

  handleEvent (kind: string, err: Error) {
    if (err) {
      console.error(`err event '${kind}' from registry: ${err}`)
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
