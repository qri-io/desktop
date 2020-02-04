// globals process
import os from 'os'
import fs, { WriteStream } from 'fs'
import childProcess from 'child_process'
import path from 'path'
import rimraf from 'rimraf'

// TestBackendProcess runs the qri backend binary in connected'ed mode,
// configured for isolated testing in a temporary directory
// it expects you've installed a version of qri somewhere on your $PATH
export default class TestBackendProcess {
  qriBinPath: string
  process: any
  dir: string
  stdout: WriteStream
  stderr: WriteStream

  constructor () {
    this.qriBinPath = ''
    this.process = null
    this.dir = ''
  }

  start () {
    // const { resourcesPath = '' } = process
    // Locate the binary for the qri backend command-line
    // this.qriBinPath = this.findQriBin(['qri', resourcesPath, path.join(__dirname, '../../')])
    this.qriBinPath = this.findQriBin()
    if (this.qriBinPath === '') {
      throw `couldn't find a qri binary on your $PATH, please install qri backend to run e2e tests`
    }
    // Run the binary if it is found
    console.log(`using qri binary: '${this.qriBinPath}'`)
    this.launchProcess()
  }

  close () {
    this.teardownRepo()
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }

  launchProcess () {
    try {
      const [ base, qriPath, ipfsPath ] = this.setupRepo()

      this.stdout = fs.createWriteStream(path.join(base, 'stdout.log'))
      this.stderr = fs.createWriteStream(path.join(base, 'stderr.log'))
      this.process = childProcess.spawn(this.qriBinPath, ['connect', '--setup'], {
        // stdio: ['pipe', this.stdout, this.stderr],
        env: Object.assign(process.env, {
          'QRI_SETUP_CONFIG_DATA': qriConfig,
          'QRI_PATH': qriPath,
          'IPFS_PATH': ipfsPath
        })
      })

      this.process.stdout.pipe(this.stdout);
      this.process.stderr.pipe(this.stderr);

      this.process.on('error', (err: any) => { this.handleEvent('error', err) })
      this.process.on('exit', () => {  /* noop */ })
      this.process.on('close', (err: any) => { this.teardownRepo() })
      this.process.on('disconnect', (err: any) => { this.handleEvent('disconnect', err) })
    } catch (err) {
      console.log('ERROR, Starting background process: ' + err)
    }
  }

  handleEvent (kind: string, err: Error) {
    if (err) {
      console.log(`err event '${kind}' from backend: ${err}`)
    } else {
      console.log(`event '${kind}' from backend`)
    }
  }

  findQriBin () {
    const { stdout = '' } = childProcess.spawnSync('which', ['qri'])
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
    throw 'Could not find qri binary'
  }

  setupRepo() {
    this.dir = path.join(os.tmpdir(), 'qri_desktop_test_backend')
    fs.mkdirSync(this.dir)

    const qriPath = path.join(this.dir, '.qri')
    fs.mkdirSync(qriPath)
    
    const ipfsPath = path.join(this.dir, '.ipfs')
    fs.mkdirSync(ipfsPath)

    return [this.dir, qriPath, ipfsPath]
  }

  teardownRepo() {
    if (this.dir !== '') {
      rimraf(this.dir, (err) => {
        if (err) {
          console.log(err) 
        }
      })
      this.dir = ''
    }
  }
}

const qriConfig = `{
  "Revision": 1,
  "Profile": {
    "id": "QmboGUXqS1hvxKD92RaSCh2G29bDwJqxVmHUVop5ePxqtz",
    "privkey": "CAASqQkwggSlAgEAAoIBAQDGAumEqEOdSX/PIwfoEYq58Idgnx6Y671OnqHNcBkuK3XTw+vSyZduY10O9Ej9m1+5Yc5/twZ1uHPW3B0sY+uSScnD3L4TLMH/gBFU0GWh3AHiTBcvNZA1zlEq9pKAfXMm5EzSI+4mlo6wlKO8NnJ0Qyb9LaAsA/1aBO19VmxWeVndV4ckjrJ7yN8NvgkUxqpnFnqAP3f6sMSe7bcRUA6+3VXl4UPdpraYeI1W1YCdUBjKZ8F4+f0mEIpd++eQB6TtZ46Ve+SsXJEHB/K2eZcOL4KOkeTcAI9Dl9AkSsZsBeHGjWItOB2VH3MRAQH60hy71ZjbhhpxQD1F6m9bG1mPAgMBAAECggEBAIXzBmGVKlhGlk1bl0eoRj5OtmXoflxYbPG4YiCFiqMvB0BAM1GeyfAFC7jIDHBzIShZP8Yp3BbatpJMyPd0iLGndPQoafSyvHHJAvBrIbWDDUs2yiBHjcy4SzRTJPwC4VkX69fkMoCsLM7LXpA+DOMVYlS2/rmH4WV6G+ZEBnnf37UfW7VRX8L9MHwhZOEpJFYlcR0UChpFpA5zzTt+ePqdYZRFklT2Jwol+xlx/EXFbq2wIuHhxFgubiJ3IHKVyh4mSCDyt1wzfQTe9l33TEhQzJcbWidN8blBlXi2jXqSOTJgkCOHe2EC7VuY9T6EKfdJ9vtxv1QRHvjZmFF4HwECgYEAzQUuRAzjOn6z05vNcy0pKoJtsrwJF6SpTOQrH1/ejHO0snKVyISw9uXBuf6KpNmUAqre0GMnv1shyC7PVXFKX2qaqWne16Nx7EjhA2Tm8kGJ0s9HFxLLgLk3aOUYRfAGGm+k1Y0uOR+GYubWnIcHIeBz+N/MXHCi77n9aeIDFU8CgYEA9z+S2Ncs9UFXUG3r6f/JWldICom8FJAwnSKeTvC+VvfYJ4vgGToHnVm8sleO/1YDIaRuwe6KVn7kPGA5xvf1Gv0t+8aOt5qTTiMThp/UKHfliLaSwarnJLIP2NCnKm20HOlwjiwRnP5Ae4S0oR2te1PtU/Ytj0QRXICX46ES58ECgYEAtsJYhNcMNBfAS/FGStbGLJvKGBtg64+gT+fRvQ0kAQYf3Tch6HbInb8gW6HZi6xdMaeKKi9Jvl4Jlj6MGnl8N+R67Gxw9r8/jcdFtlXbPbdImgCmOZ5KhHwXNc2LPsUBW82MHcXVn5xHmqB2TWBc7kj8eK1fqkPKK3MbwKh14ScCgYB2OjYT7kCXPhlsYkOO7zrvMhFGyLng81nrqaQdh0zc9UKtFlugdHkzqrdqaCf+vLhem+xCW7hWx/KHVFQMaoEP2MTmQfn4nbeWg3tQwpiGiV5+0x618Oz6RRMC0DM/PJoFwTKLKVN6yLE43yooaLKN6IHxxiPe/+N1YiA/PsR1gQKBgQDDSk9hHxfffxVT3fuP1tVHHBL6ubP+U3w97jaa3pplnOSN/gxSamxcaVxPeCmCkIxUifPj1WWCHRkUuUOWT2JkqCvR1/kwCOmYBgpvSD7/R97lCPtVvNXueYZQODZPboeTaJwv2Q9y2YcR2PXO62ZyVyUOybtF1UfhZLXksEuvCQ==",
    "peername": "nuun",
    "created": "2019-09-05T16:03:21-04:00",
    "updated": "2019-08-26T13:29:51.130046-04:00",
    "type": "peer",
    "email": "brendan+nuun@qri.io",
    "name": "",
    "description": "",
    "homeurl": "",
    "color": "",
    "thumb": "",
    "photo": "",
    "poster": "",
    "twitter": ""
  },
  "Repo": {
    "middleware": [],
    "type": "fs"
  },
  "Store": {
    "type": "ipfs",
    "options": {
      "api": true
    }
  },
  "P2P": {
    "enabled": true,
    "peerid": "QmboGUXqS1hvxKD92RaSCh2G29bDwJqxVmHUVop5ePxqtz",
    "pubkey": "",
    "privkey": "CAASqQkwggSlAgEAAoIBAQDGAumEqEOdSX/PIwfoEYq58Idgnx6Y671OnqHNcBkuK3XTw+vSyZduY10O9Ej9m1+5Yc5/twZ1uHPW3B0sY+uSScnD3L4TLMH/gBFU0GWh3AHiTBcvNZA1zlEq9pKAfXMm5EzSI+4mlo6wlKO8NnJ0Qyb9LaAsA/1aBO19VmxWeVndV4ckjrJ7yN8NvgkUxqpnFnqAP3f6sMSe7bcRUA6+3VXl4UPdpraYeI1W1YCdUBjKZ8F4+f0mEIpd++eQB6TtZ46Ve+SsXJEHB/K2eZcOL4KOkeTcAI9Dl9AkSsZsBeHGjWItOB2VH3MRAQH60hy71ZjbhhpxQD1F6m9bG1mPAgMBAAECggEBAIXzBmGVKlhGlk1bl0eoRj5OtmXoflxYbPG4YiCFiqMvB0BAM1GeyfAFC7jIDHBzIShZP8Yp3BbatpJMyPd0iLGndPQoafSyvHHJAvBrIbWDDUs2yiBHjcy4SzRTJPwC4VkX69fkMoCsLM7LXpA+DOMVYlS2/rmH4WV6G+ZEBnnf37UfW7VRX8L9MHwhZOEpJFYlcR0UChpFpA5zzTt+ePqdYZRFklT2Jwol+xlx/EXFbq2wIuHhxFgubiJ3IHKVyh4mSCDyt1wzfQTe9l33TEhQzJcbWidN8blBlXi2jXqSOTJgkCOHe2EC7VuY9T6EKfdJ9vtxv1QRHvjZmFF4HwECgYEAzQUuRAzjOn6z05vNcy0pKoJtsrwJF6SpTOQrH1/ejHO0snKVyISw9uXBuf6KpNmUAqre0GMnv1shyC7PVXFKX2qaqWne16Nx7EjhA2Tm8kGJ0s9HFxLLgLk3aOUYRfAGGm+k1Y0uOR+GYubWnIcHIeBz+N/MXHCi77n9aeIDFU8CgYEA9z+S2Ncs9UFXUG3r6f/JWldICom8FJAwnSKeTvC+VvfYJ4vgGToHnVm8sleO/1YDIaRuwe6KVn7kPGA5xvf1Gv0t+8aOt5qTTiMThp/UKHfliLaSwarnJLIP2NCnKm20HOlwjiwRnP5Ae4S0oR2te1PtU/Ytj0QRXICX46ES58ECgYEAtsJYhNcMNBfAS/FGStbGLJvKGBtg64+gT+fRvQ0kAQYf3Tch6HbInb8gW6HZi6xdMaeKKi9Jvl4Jlj6MGnl8N+R67Gxw9r8/jcdFtlXbPbdImgCmOZ5KhHwXNc2LPsUBW82MHcXVn5xHmqB2TWBc7kj8eK1fqkPKK3MbwKh14ScCgYB2OjYT7kCXPhlsYkOO7zrvMhFGyLng81nrqaQdh0zc9UKtFlugdHkzqrdqaCf+vLhem+xCW7hWx/KHVFQMaoEP2MTmQfn4nbeWg3tQwpiGiV5+0x618Oz6RRMC0DM/PJoFwTKLKVN6yLE43yooaLKN6IHxxiPe/+N1YiA/PsR1gQKBgQDDSk9hHxfffxVT3fuP1tVHHBL6ubP+U3w97jaa3pplnOSN/gxSamxcaVxPeCmCkIxUifPj1WWCHRkUuUOWT2JkqCvR1/kwCOmYBgpvSD7/R97lCPtVvNXueYZQODZPboeTaJwv2Q9y2YcR2PXO62ZyVyUOybtF1UfhZLXksEuvCQ==",
    "port": 0,
    "addrs": null,
    "qribootstrapaddrs": [
      "/ip4/35.239.80.82/tcp/4001/ipfs/QmdpGkbqDYRPCcwLYnEm8oYGz2G9aUZn9WwPjqvqw3XUAc",
      "/ip4/35.225.152.38/tcp/4001/ipfs/QmTRqTLbKndFC2rp6VzpyApxHCLrFV35setF1DQZaRWPVf",
      "/ip4/35.202.155.225/tcp/4001/ipfs/QmegNYmwHUQFc3v3eemsYUVf3WiSg4RcMrh3hovA5LncJ2",
      "/ip4/35.238.10.180/tcp/4001/ipfs/QmessbA6uGLJ7HTwbUJ2niE49WbdPfzi27tdYXdAaGRB4G",
      "/ip4/35.238.105.35/tcp/4001/ipfs/Qmc353gHY5Wx5iHKHPYj3QDqHP4hVA1MpoSsT6hwSyVx3r",
      "/ip4/35.239.138.186/tcp/4001/ipfs/QmT9YHJF2YkysLqWhhiVTL5526VFtavic3bVueF9rCsjVi",
      "/ip4/35.226.44.58/tcp/4001/ipfs/QmQS2ryqZrjJtPKDy9VTkdPwdUSpTi1TdpGUaqAVwfxcNh"
    ],
    "httpgatewayaddr": "https://ipfs.io",
    "profilereplication": "full",
    "bootstrapaddrs": null,
    "autoNAT": false
  },
  "Update": {
    "type": "fs",
    "daemonize": true,
    "address": "127.0.0.1:2506"
  },
  "Registry": {
    "location": "http://localhost:3000"
  },
  "Remotes": null,
  "Remote": null,
  "CLI": {
    "colorizeoutput": true
  },
  "API": {
    "enabled": true,
    "port": 2503,
    "readonly": false,
    "remotemode": false,
    "remoteacceptsizemax": 0,
    "remoteaccepttimeoutms": 0,
    "urlroot": "",
    "tls": false,
    "proxyforcehttps": false,
    "allowedorigins": [
      "electron://local.qri.io",
      "http://localhost:2505",
      "http://app.qri.io",
      "https://app.qri.io"
    ],
    "serveremotetraffic": true
  },
  "Webapp": {
    "enabled": true,
    "port": 2505,
    "analyticstoken": "",
    "entrypointupdateaddress": "/ipns/webapp.qri.io",
    "entrypointhash": "/ipfs/QmXofmXcQKnYTMjsfhgTGqzzLLPyS9enaHsfaRR5AxTGBK"
  },
  "RPC": {
    "enabled": true,
    "port": 2504
  },
  "Logging": {
    "levels": {
      "lib": "debug",
      "qriapi": "info",
      "qrip2p": "info",
      "remote": "info"
    }
  },
  "Render": {
    "templateUpdateAddress": "/ipns/defaulttmpl.qri.io",
    "defaultTemplateHash": "/ipfs/QmeqeRTf2Cvkqdx4xUdWi1nJB2TgCyxmemsL3H4f1eTBaw"
  }
}`
