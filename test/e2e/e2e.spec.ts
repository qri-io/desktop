import path from 'path'
import url from 'url'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import fakeDialog from 'spectron-fake-dialog'

const { Application } = require('spectron')

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))

describe('Qri End to End tests', function spec () {
  let app: any
  let backend: any

  beforeAll(async () => {
    // spin up a new mock backend with a mock registry server attached
    backend = new TestBackendProcess()
    await backend.start()
    // use spectron to launch desktop with programmatic control

    // check the environment variables to determine whether to run headless chrome
    const headless = process.env.HEADLESS_CHROME === 'true'

    app = new Application({
      path: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      args: [path.join(__dirname, '..', '..', 'app')],

      // When running in circleci or in, for example, a docker container with no
      // display, we must run spectron on headless chrome and use xvfb to mock a
      // display. Check the .circleci configuration: the '-browsers' extension on
      // the docker image type gives us an image that contains chrome and xvfb.
      // The `chromeDriverArgs` options configure chrome driver correctly for
      // headless use.
      chromeDriverArgs: headless ? ['headless', 'no-sandbox', 'disable-dev-shm-usage'] : []
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
    const { client, browserWindow } = app

    await client.waitUntilWindowLoaded()
    const title = await browserWindow.getTitle()
    expect(title).toBe('Qri Desktop')
  })

  it('accept terms by clicking enter, taken to signup', async () => {
    const { client, browserWindow } = app

    await client.waitUntilWindowLoaded()
    await delay(10000)
    await client.click('#accept')

    await delay(1000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/signup')
  })

  it('create a new account, taken to datasets page', async () => {
    const { client, browserWindow } = app

    await client.waitUntilWindowLoaded()
    await client.element('[name="username"]').setValue('fred')
    await client.element('[name="email"]').setValue('fred@qri.io')
    await client.element('[name="password"]').setValue('1234567890!!')
    await delay(550) // wait for validation debounce
    await client.click('#accept')

    await delay(2000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/collection')
  })

  it('create new CSV dataset from a data source', async () => {
    const { client, browserWindow } = app

    await client.click('#create_dataset')
    await delay(600) // wait for modal render

    const csvPath = path.join(backend.dir, 'e2e_test_csv_dataset.csv')
    fs.writeFileSync(csvPath, 'e2e_test_bool_col,a,b,c\nfalse,1,2,3\ntrue,4,5,6')
    fakeDialog.mock([ { method: 'showOpenDialog', value: [csvPath] } ])
    await client.click('#chooseBodyFilePath')

    await delay(550) // wait for validation debounce
    await client.click('#submit')

    await delay(3000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/dataset')
    expect(await client.element('#linkButton .label').getText()).toBe('Show Files')

    // dataset name is fred/e2e_test_csv_dataset
    expect(await client.element('#current_dataset .header-column-text .name').getText()).toBe('fred/e2e_test_csv_dataset')

    // status dots are correct
    expect(await client.element('#meta_status .status-dot-added').isExisting()).toBe(true)
    expect(await client.element('#body_status .status-dot-added').isExisting()).toBe(true)
    expect(await client.element('#structure_status .status-dot-added').isExisting()).toBe(true)

    // create commit
    expect(await client.element('#commit_nudge').getText()).toContain('ready to make your first commit')
    await client.element('#commit_title').setValue('Created Dataset')
    await client.click('#commit_submit')
    await delay(2000)
    // history list should have one commit
    await client.click('#history_tab')
    var history_list_items = await client.$$('#history_list .sidebar-list-item')
    await expect(history_list_items.length).toBe(1)
    // change body file and check to see if status changed
    await client.click('#status_tab')
    const bodyPath = path.join(backend.dir, 'e2e_test_csv_dataset', 'body.csv')
    fs.writeFileSync(bodyPath, 'e2e_test_bool_col,a,b,c\nfalse,1,2,3\ntrue,4,5,6\ntrue,7,8,9')
    await delay(3000)
    expect(await client.element('#body_status .status-dot-modified').isExisting()).toBe(true)
    // add title to meta
    //
    await client.click('#meta_status')
    await delay(2000)
    await client.click('#title')
    await client.element('#title').setValue('Title of e2e test dataset')
    await client.click('#description')
    await delay(3000) // time to save change and status to fetch changes
    // add commit
    expect(await client.element('#meta_status .status-dot-modified').isExisting()).toBe(true)
    await client.element('#commit_title').setValue('Changed body and added meta data')
    await client.click('#commit_submit')
    await delay(2000)
    // history list should have two commits
    await client.click('#history_tab')
    history_list_items = await client.$$('#history_list .sidebar-list-item')
    await expect(history_list_items.length).toBe(2)
    await delay(1000)
  })

  it('return an error when trying to add a dataset that does not exist', async () => {
    const { client } = app

    await client.click('#collection')
    await delay(300) // wait for dataset list render
    await client.click('#add_dataset')
    await delay(600) // wait for modal render
    await client.element('[name="datasetName"]').setValue('b5/not_a_real_dataset')
    await delay(600) // wait for modal render

    // implement mock registry server:
    // expect(await client.element("#add_error").getText()).toBe('Dataset not found.')
    expect(await client.element('#add_error').getText()).toBe('dataset name resolution currently only works over HTTP')
  })
})
