import path from 'path'
import url from 'url'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import fakeDialog from 'spectron-fake-dialog'

const { Application } = require('spectron');

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))

describe('onboarding', function spec() {
  let app: any
  let backend: any

  beforeAll(async () => {
    // spin up a new mock backend with a mock registry server attached
    backend = new TestBackendProcess()
    await backend.start()
    
    // use spectron to launch desktop with programmatic control
    app = new Application({
      path: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      args: [path.join(__dirname, '..', '..', 'app')]
    })
    fakeDialog.apply(app)
    return app.start()
  })

  afterAll(async () => {
    await delay(500)
    backend.close()
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('open window', async () => {
    const { client, browserWindow } = app;

    await client.waitUntilWindowLoaded()
    await delay(500)
    const title = await browserWindow.getTitle()
    expect(title).toBe('Qri Desktop')
  })

  it('accept terms by clicking enter, taken to signup', async () => {
    const { client, browserWindow } = app
    
    await client.waitUntilWindowLoaded()
    await delay(1500)
    await client.click('#accept')

    await delay(1000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/signup')
  })

  it('create a new account, taken to no datasets', async () => {
    const { client, browserWindow } = app
    
    await client.waitUntilWindowLoaded()
    await client.element('[name="username"]').setValue('fred')
    await client.element('[name="email"]').setValue('fred@qri.io')
    await client.element('[name="password"]').setValue('1234567890!!')
    await delay(550) // wait for validation debounce
    await client.click('#accept')

    await delay(1000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/nodatasets')
  })

  it('create new dataset from a data source', async () => {
    const { client, browserWindow } = app

    await client.click('#create_dataset')
    await delay(600) // wait for modal render

    const csvPath = path.join(backend.dir, 'e2e_test_dataset.csv')
    fs.writeFileSync(csvPath, 'e2e_test_bool_col,a,b,c\nfalse,1,2,3\ntrue,4,5,6')
    fakeDialog.mock([ { method: 'showOpenDialog', value: [csvPath] } ])
    await client.click('#chooseBodyFilePath')

    fakeDialog.mock([ { method: 'showOpenDialog', value: [backend.dir] } ])
    await client.click('#chooseSavePath')
    await delay(550) // wait for validation debounce
    await client.click('#submit')

    await delay(1000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/dataset')
    expect(await app.client.element('#linkButton .label').getText()).toBe('Show Files');
  })

  // it('create initial commit', () => {
  // })

  it('logs in console of main window should be at most 1', async () => {
    const { client } = app;
    const logs = await client.getRenderProcessLogs();
    // Print renderer process logs
    logs.forEach((log: any) => {
      console.log(log.level, log.message)
    });
    // TODO (b5) - currently can't figure out how to eliminate the ""'electron.screen' is deprecated"
    // once we get rid of that error, drop this to zero
    expect(logs).toHaveLength(1)
  })
})
