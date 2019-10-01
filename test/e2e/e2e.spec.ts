import path from 'path'
import url from 'url'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import fakeDialog from 'spectron-fake-dialog'

const { Application } = require('spectron');

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))

describe('Qri End to End tests', function spec() {
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
    await delay(2500)
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

    await delay(1000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/dataset')
    expect(await app.client.element('#no-datasets-page .welcome-title h2').getText()).toBe('Let\'s get some datasets')
  })

  it('create new CSV dataset from a data source', async () => {
    const { client, browserWindow } = app

    await client.click('#create_dataset')
    await delay(600) // wait for modal render

    const csvPath = path.join(backend.dir, 'e2e_test_csv_dataset.csv')
    fs.writeFileSync(csvPath, 'e2e_test_bool_col,a,b,c\nfalse,1,2,3\ntrue,4,5,6')
    fakeDialog.mock([ { method: 'showOpenDialog', value: [csvPath] } ])
    await client.click('#chooseBodyFilePath')

    fakeDialog.mock([ { method: 'showOpenDialog', value: [backend.dir] } ])
    await client.click('#chooseSavePath')
    await delay(550) // wait for validation debounce
    await client.click('#submit')

    await delay(3000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/dataset')
    expect(await client.element('#linkButton .label').getText()).toBe('Show Files')

    // dataset name is fred/e2e_test_csv_dataset
    expect(await client.element('#current_dataset .header-column-text .name').getText()).toBe('fred/e2e_test_csv_dataset')

    // status dots are correct
    expect(await client.element('#meta_status .status-dot-added').isExisting()).toBe(true);
    expect(await client.element('#body_status .status-dot-added').isExisting()).toBe(true)
    expect(await client.element('#schema_status .status-dot-transparent').isExisting()).toBe(true)

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
    expect(await client.element('#body_status .status-dot-modified').isExisting()).toBe(true);
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

  it('create new JSON dataset from a data source', async () => {
    const { client, browserWindow } = app
    await client.click('#current_dataset')
    await delay(300) // wait for dataset list render
    await client.click('#dataset_list_create')
    await delay(600) // wait for modal render

    const jsonPath = path.join(backend.dir, 'e2e_test_json_dataset.json')
    fs.writeFileSync(jsonPath, '{"first_row":[1,2,3],"second_row":[4,5,6],"third_row":[7,8,9]}')
    fakeDialog.mock([ { method: 'showOpenDialog', value: [jsonPath] } ])
    await client.click('#chooseBodyFilePath')

    fakeDialog.mock([ { method: 'showOpenDialog', value: [backend.dir] } ])
    await client.click('#chooseSavePath')
    await delay(550) // wait for validation debounce
    await client.click('#submit')

    await delay(3000)
    const currentUrl = url.parse(await browserWindow.getURL())
    expect(currentUrl.hash).toBe('#/dataset')
    expect(await client.element('#linkButton .label').getText()).toBe('Show Files')

    // dataset name is fred/e2e_test_csv_dataset
    expect(await client.element('#current_dataset .header-column-text .name').getText()).toBe('fred/e2e_test_json_dataset')

    // status dots are correct
    expect(await client.element('#meta_status .status-dot-added').isExisting()).toBe(true);
    expect(await client.element('#body_status .status-dot-added').isExisting()).toBe(true)
    expect(await client.element('#schema_status .status-dot-transparent').isExisting()).toBe(true)

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
    const bodyPath = path.join(backend.dir, 'e2e_test_json_dataset', 'body.json')
    fs.writeFileSync(bodyPath, '{"first_row":[1,2,3],"second_row":[4,5,6]}')
    await delay(3000)
    expect(await client.element('#body_status .status-dot-modified').isExisting()).toBe(true);
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

    await client.click('#current_dataset')
    await delay(300) // wait for dataset list render
    await client.click('#dataset_list_add')
    await delay(600) // wait for modal render
    await client.element('[name="datasetName"]').setValue('b5/not_a_real_dataset')
    await delay(600) // wait for modal render
    // should have saved the savePath of the previously used directory
    expect(await client.element('[name="savePath"]').getValue()).toBe(backend.dir)
    await client.click('#submit')
    await delay(3500)
    expect(await client.element("#add_error").getText()).toBe('Dataset not found.')

  })

  // TODO (b5) - we should be dropping console output to zero
  it('logs in console of main window should be at most 5', async () => {
    const { client } = app;
    const logs = await client.getRenderProcessLogs();
    // Print renderer process logs
    logs.forEach((log: any) => {
      console.log(log.level, log.message)
    });
    // TODO (b5) - currently can't figure out how to eliminate the ""'electron.screen' is deprecated"
    // once we get rid of that error, drop this to zero
    expect(logs.length).toBeLessThan(7)
  })
})
