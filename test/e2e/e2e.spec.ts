import path from 'path'
import os from 'os'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import TestTempRegistry from '../utils/testTempRegistry'
import fakeDialog from 'spectron-fake-dialog'
import { E2ETestUtils, newE2ETestUtils } from '../utils/e2eTestUtils'
import http from 'http'
import Dataset, { Commit, Meta, Structure } from '../../app/models/dataset'
import { lazy } from 'react'
import { JSONSchema7 } from 'json-schema'
import SchemaItemProps from '../../app/components/item/SchemaItem'

const { Application } = require('spectron')

const takeScreenshots = false

function artifactPathFromDir (dir: string, s: string): string {
  return path.join(dir, s)
}

describe('Qri End to End tests', function spec () {
  let app: any
  let backend: any
  let registry: any
  const imagesDir = process.env.E2E_ARTIFACTS_PATH || os.tmpdir()
  const artifactPath = (s: string) => {
    return artifactPathFromDir(imagesDir, s)
  }

  console.log(`storing artifacts at: ${imagesDir}`)

  // The utility functions we use to build our e2e tests
  // declared in this scope so they can be accessed by all tests
  // initialized in the `beforeAll` function
  let utils: E2ETestUtils

  const filename = 'all_week.csv'
  const datasetName = 'all_weekcsv'
  const datasetRename = 'earthquakes'

  const jsonFilename = 'test_dataset.json'
  const jsonDatasetName = 'test_datasetjson'

  const username = 'fred'
  const email = 'fred@qri.io'
  const password = '1234567890!!'

  const metaCommit: Commit = {
    title: 'edited meta',
    message: 'added all standard metadata',
    timestamp: new Date(Date.UTC(0, 0, 0, 0, 0, 0))
  }
  const bodyCommitTitle = 'remove rows'
  const bodyCommitMessage = 'changed body using fsi'

  const meta: Meta = {
    title: 'Earthquakes',
    description: 'List of all earthquakes and their magnitudes',
    theme: ['geology'],
    keyworks: ['earthquakes', 'USGS'],
    license: {
      type: "Open Data Commons Attribution License (ODC-By)",
      url: "http://opendatacommons.org/licenses/by/1.0/"
    },
    contributors: [{ id: '000', name: 'fred', email: 'fred@qri.io' }],
    citations: [{ name: 'mary', url: 'mary.com', email: 'mary@qri.io' }],
    accessURL: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php',
    downloadURL: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv',
    homeURL: 'https://earthquake.usgs.gov/',
    readmeURL: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php',
    accrualPeriodicity: 'Monthly',
    version: '1.0.0',
    language: ['english'],
    identifier: '10000000'
  }

  const csvStructure: Structure = {
    format: 'csv',
    formatConfig: {
      headerRow: true,
      variadicFields: true,
      lazyQuotes: true
    },
    schema: {
      items: {
        items: [
          {
            'title': 'new_title_0',
            'description': 'description_0'
            // 'validation': 'validation_0'
          },
          {
            'title': 'new_title_1',
            'description': 'description_1'
            // 'validation': 'validation_1'
          }
        ],
        type: 'array'
      },
      type: 'array'
    }
  }

  const structureCommit: Commit = {
    title: 'edited Structure',
    message: 'edited format config and some schema fields',
    timestamp: metaCommit.timestamp
  }

  const readme = 'Hello World! This is my readme'
  const readmeCommit: Commit = {
    title: 'edited readme',
    message: 'added a short readme',
    timestamp: metaCommit.timestamp
  }

  const registryDatasetName = 'synths'
  const registryLoc = 'http://localhost:2500'
  const registryNewCommitAction = '/sim/action?action=appendsynthsdataset'

  beforeAll(async () => {
    jest.setTimeout(60000)

    registry = new TestTempRegistry()
    await registry.start()

    // spin up a new mock backend with a mock registry server attached
    backend = new TestBackendProcess()
    await backend.start()
    // use spectron to launch desktop with programmatic control

    // check the environment variables to determine whether to run headless chrome
    const headless = process.env.HEADLESS_CHROME === 'true'

    // path to the electron application to run with spectron
    // TODO(dlong): The default path here does not work under Windows (WebDriverIO will stall
    // in the `init` fuction, and the app opens multiple times in a retry loop). The path ending
    // in ".exe" will work under Windows. Perhaps other platforms, such as OSX, should also be
    // using the binary in the "dist" folder.
    let electronAppPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron')
    if (process.platform === 'win32') {
      electronAppPath = path.join(__dirname, '..', '..', 'node_modules', 'electron',
        'dist', 'electron.exe')
    }

    app = new Application({
      path: electronAppPath,
      args: [path.join(__dirname, '..', '..', 'app')],

      // When running in circleci or in, for example, a docker container with no
      // display, we must run spectron on headless chrome and use xvfb to mock a
      // display. Check the .circleci configuration: the '-browsers' extension on
      // the docker image type gives us an image that contains chrome and xvfb.
      // The `chromeDriverArgs` options configure chrome driver correctly for
      // headless use.
      chromeDriverArgs: headless ? ['headless', 'no-sandbox', 'disable-dev-shm-usage'] : [],
      // Logging will make it easier to debug problems.
      env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_ENABLE_STACK_DUMPING: true
      },
      chromeDriverLogPath: path.join(__dirname, '../log/chromedriverlog.txt'),
      webdriverLogPath: path.join(__dirname, '../log/webdriverlog.txt'),
      waitTimeout: 10e3,
      connectionRetryCount: 1
    })
    fakeDialog.apply(app)
    utils = newE2ETestUtils(app)
    return app.start()
  })

  afterAll(async () => {
    await utils.delay(500)
    backend.close()
    registry.close()
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('open window', async () => {
    const { client, browserWindow } = app
    const {
      takeScreenshot
    } = utils

    await client.waitUntilWindowLoaded()
    const title = await browserWindow.getTitle()
    expect(title).toBe('Qri Desktop')
    if (takeScreenshots) {
      await takeScreenshot(artifactPath('loading.png'))
    }
  })

  it('accept terms of service by clicking accept and get taken to signup', async () => {
    const {
      atLocation,
      waitForExist,
      click,
      exists,
      takeScreenshot
    } = utils

    // Make sure the page is loaded
    await waitForExist('#welcome-page')

    // expected ids
    await exists(['#tos', '#accept'])

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('tos.png'), 1000)
    }

    // click to accept the toss
    await click('#accept')

    // make sure we navigated to the correct page
    await atLocation('#/onboard/signup', artifactPath('accept_terms_of_service_by_clicking_accept_and_get_taken_to_signup.png'))
  })

  it('create a new account, taken to datasets page', async () => {
    const {
      atLocation,
      waitForExist,
      click,
      setValue,
      exists,
      takeScreenshot
    } = utils

    // Make sure the page is loaded
    await waitForExist('#signup-page')

    // expected ids
    await exists(['#username', '#email', '#password', '#accept'])

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('signup.png'))
    }

    // Input username, email, and password
    await setValue('#username', username)
    await setValue('#email', email)
    await setValue('#password', password)

    // click accept
    await click('#accept')

    // make sure we are on the collection page
    await atLocation('#/collection', artifactPath('create_a_new_account_taken_to_datasets_page.png'))
  })

  // signout and sign in
  it('signout and sign in', async () => {
    const {
      click,
      setValue,
      atLocation,
      takeScreenshot
    } = utils

    // click profile
    await click('#nav-options')
    // click signout
    await click('#signout')
    // on signup page
    await atLocation('#/onboard/signup')
    // navigate to signin page
    await click('#signin')
    // ensure we are on signin page
    await atLocation('#/signin')
    // set username and password
    await setValue('#username', username)
    await setValue('#password', password)
    // submit
    await click('#accept')
    // we are left on the collection page
    await atLocation('#/collection')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('no-datasets-collection.png'))
    }
  })

  it('create new CSV dataset from a data source', async () => {
    const {
      atLocation,
      click,
      expectTextToBe,
      onHistoryTab,
      checkStatus,
      takeScreenshot
    } = utils

    // make sure we are on the collection page
    await atLocation('#/collection')

    // click create-dataset to open up the Create Dataset modal
    await click('#create-dataset')

    // mock the dialog and create a temp csv file
    // clicking the '#chooseBodyFilePath' button will connect the fakeDialog
    // to the correct input
    const csvPath = path.join(backend.dir, filename)
    fs.writeFileSync(csvPath, earthquakeDataset)
    await fakeDialog.mock([ { method: 'showOpenDialogSync', value: [csvPath] } ])
    await click('#chooseBodyFilePath')

    // submit to create a new dataset
    await click('#submit')

    // ensure we are redirected to the workbench
    await atLocation(`#/workbench`)

    // ensure we have navigated to the correct dataset
    // TODO (ramfox): it's weird that we have to pass in this newline character
    // to get the reference to match. It looks like because the #dataset-reference
    // div divides the peername and name among multiple divs, we get this odd
    // whitespace character
    const reference = `${username}/\n${datasetName}`
    await expectTextToBe('#dataset-reference', reference)

    // enure we are on the history tab
    await onHistoryTab()

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-workbench-history.png'))
    }

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('structure', 'added')
  })

  it('navigate to collection and back to dataset', async () => {
    const {
      atLocation,
      click,
      expectTextToBe,
      onHistoryTab
    } = utils

    await click('#history-tab')
    await onHistoryTab()

    await click('#collection')
    // ensure we have redirected to the collection page
    await atLocation('#/collection')
    // click the dataset
    const ref = `#${username}-${datasetName}`
    await click(ref)
    // ensure we have redirected to the dataset page
    await atLocation(`#/workbench/${username}/${datasetName}`)
    // ensure we are still at the history tab
    await onHistoryTab()
    // ensure we have a commit title
    await expectTextToBe('#commit-title', 'created dataset')
  })

  // checkout
  it('checkout a dataset', async () => {
    const {
      atLocation,
      click,
      onStatusTab,
      waitForNotExist,
      takeScreenshot
    } = utils

    // at dataset
    await click('#workbench')
    // at status
    await click('#status-tab')
    await onStatusTab()

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('workbench-checkout.png'))
    }

    // click #checkout to open checkout modal
    await click('#checkout')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('checkout-modal.png'))
    }

    // mock the dialog
    await fakeDialog.mock([ { method: 'showOpenDialogSync', value: [backend.dir] } ])
    // click #chooseSavePath to open dialog
    await click('#chooseSavePath')
    // click #submit
    await click('#submit')
    // expect modal to be gone
    await waitForNotExist('#checkout-dataset')
    // atLocation
    await atLocation(`#/workbench`)
    // check we are at status tab
    await onStatusTab()

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-workbench-status.png'))
    }
  })

  // body write & commit
  it('write the body to the filesystem & commit', async () => {
    const {
      click,
      checkStatus,
      doesNotExist,
      setValue,
      expectTextToBe,
      onHistoryTab,
      waitForExist
    } = utils

    // on dataset page
    await click('#workbench', artifactPath('write-the-body-to-the-filesystem-and-commit-click-workbench.png'))
    // on status tab
    await click('#status-tab', artifactPath('write-the-body-to-the-filesystem-and-commit-click-status.png'))
    // no changes, so cannot commit
    await doesNotExist('.clear-to-commit #commit-status', artifactPath('write-the-body-to-the-filesystem-and-commit-does-not-exist-clear-to-commit.png'))
    // create file in memory and save over the previous body.csv
    const csvPath = path.join(backend.dir, datasetName, 'body.csv')
    fs.writeFileSync(csvPath, earthquakeDatasetEdit)
    // body status should be modified
    await checkStatus('body', 'modified', artifactPath('write-the-body-to-the-filesystem-and-commit-check-status-body-modified.png'))
    // commit should be active
    await waitForExist('.clear-to-commit #commit-status', artifactPath('write-the-body-to-the-filesystem-and-commit-exists-clear-to-commit.png'))
    // navigate to commit
    await click('#commit-status', artifactPath('write-the-body-to-the-filesystem-and-commit-click-commit-status.png'))
    // set value of title & message
    await setValue('#title', bodyCommitTitle, artifactPath('write-the-body-to-the-filesystem-and-commit-set-value-title.png'))
    await setValue('#message', bodyCommitMessage, artifactPath('write-the-body-to-the-filesystem-and-commit-set-value-message.png'))
    // send accept
    await click('#submit', artifactPath('write-the-body-to-the-filesystem-and-commit-click-status2.png'))
    // should be on the history tab
    await onHistoryTab(artifactPath('write-the-body-to-the-filesystem-and-commit-on-history-tab.png'))
    // body status should be modified
    await checkStatus('body', 'modified', artifactPath('write-the-body-to-the-filesystem-and-commit-check-status-body2.png'))
    // title should be the same as title we added
    await expectTextToBe('#commit-title', bodyCommitTitle, artifactPath('write-the-body-to-the-filesystem-and-commit-expect-text-to-be-commit-title.png'))
  })

  // meta write and commit
  it('fsi editing - create a meta & commit', async () => {
    await editMeta('fsi-meta-edit', { meta, commit: metaCommit }, 'added', utils, imagesDir)
  })

  // structure write and commit
  it('fsi editing - edit the structure & commit', async () => {
    await editCSVStructure('fsi-structure-edit', { structure: csvStructure, commit: structureCommit }, 'modified', utils, imagesDir)
  })

  // rename
  it('rename a dataset', async () => {
    const {
      click,
      waitForExist,
      atLocation,
      setValue,
      doesNotExist,
      takeScreenshot
    } = utils

    // on dataset
    await click('#workbench')
    // ensure we are on the workbench
    await atLocation(`#/workbench`)
    // click #dataset-name
    await click('#dataset-name')
    // make sure the input exists
    await waitForExist('#dataset-name-input')
    // setValue as a bad name
    await setValue('#dataset-name-input', '9test')
    // class should be error
    await waitForExist('#dataset-name-input.invalid')
    // setValue as good name
    await setValue('#dataset-name-input', datasetRename)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-workbench-rename.png'))
    }

    // get correct class
    await doesNotExist('#dataset-name-input.invalid')
    // submit by clicking away
    await click('#dataset-reference')
  })

  // switch between commits
  it('switch between commits', async () => {
    const {
      click,
      onHistoryTab,
      atLocation,
      expectTextToBe
    } = utils

    // make sure we are on the dataset page, looking at history
    await click('#workbench')
    await atLocation(`#/workbench`)
    await click('#history-tab')
    await onHistoryTab()
    await click('#commit-status')

    // click the third commit and check commit-title
    await click('#HEAD-4', artifactPath('switch-between-commits-click-head-3.png'))
    await expectTextToBe('#commit-title', 'created dataset')

    // click the second commit and check commit-title
    await click('#HEAD-3')
    await expectTextToBe('#commit-title', bodyCommitTitle)

    // click the third commit and check commit-title
    await click('#HEAD-2')
    await expectTextToBe('#commit-title', metaCommit.title)

    // click the third commit and check commit-title
    await click('#HEAD-1')
    await expectTextToBe('#commit-title', structureCommit.title)
  })

  it('create another CSV dataset from a data source', async () => {
    const {
      atLocation,
      click,
      expectTextToBe,
      onHistoryTab,
      checkStatus,
      takeScreenshot
    } = utils

    await click('#collection')
    // make sure we are on the collection page
    await atLocation('#/collection')

    // click create-dataset to open up the Create Dataset modal
    await click('#create-dataset')

    // mock the dialog and create a temp csv file
    // clicking the '#chooseBodyFilePath' button will connect the fakeDialog
    // to the correct input
    const csvPath = path.join(backend.dir, filename)
    fs.writeFileSync(csvPath, earthquakeDataset)
    await fakeDialog.mock([ { method: 'showOpenDialogSync', value: [csvPath] } ])
    await click('#chooseBodyFilePath')

    // submit to create a new dataset
    await click('#submit')

    // ensure we are redirected to the workbench
    await atLocation(`#/workbench`)

    // ensure we have navigated to the correct dataset
    // TODO (ramfox): it's weird that we have to pass in this newline character
    // to get the reference to match. It looks like because the #dataset-reference
    // div divides the peername and name among multiple divs, we get this odd
    // whitespace character
    const reference = `${username}/\n${datasetName}`
    await expectTextToBe('#dataset-reference', reference)

    // enure we are on the history tab
    await onHistoryTab()

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-workbench-history.png'))
    }

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('structure', 'added')
  })

  // meta write and commit
  it('in app editing - create a meta & commit', async () => {
    await editMeta('in-app-meta-edit', { meta, commit: metaCommit }, 'added', utils, imagesDir)
  })

  // structure write and commit
  it('in app editing - edit the structure & commit', async () => {
    await editCSVStructure('in-app-structure-edit', { structure: csvStructure, commit: structureCommit }, 'modified', utils, imagesDir)
  })

  // switch between commits
  it('switch between commits', async () => {
    const {
      delay,
      click,
      onHistoryTab,
      atLocation,
      expectTextToBe
    } = utils

    // make sure we are on the dataset page, looking at history
    await click('#workbench')
    await atLocation(`#/workbench`)
    await click('#history-tab')
    await onHistoryTab()
    await click('#commit-status')

    // click the third commit and check commit-title
    await click('#HEAD-3', artifactPath('switch-between-commits-click-head-3.png'))
    await expectTextToBe('#commit-title', 'created dataset')
    await delay(100)

    // click the third commit and check commit-title
    await click('#HEAD-2')
    await expectTextToBe('#commit-title', metaCommit.title)
    await delay(100)

    // click the third commit and check commit-title
    await click('#HEAD-1')
    await expectTextToBe('#commit-title', structureCommit.title)
    await delay(100)
  })

  it('create a new JSON dataset from a data source', async () => {
    const {
      atLocation,
      click,
      expectTextToBe,
      onHistoryTab,
      checkStatus
    } = utils

    // make sure we are on the collection page
    await click('#collection')
    await atLocation('#/collection')

    // click create-dataset to open up the Create Dataset modal
    await click('#create-dataset')

    // mock the dialog and create a temp csv file
    // clicking the '#chooseBodyFilePath' button will connect the fakeDialog
    // to the correct input
    const jsonPath = path.join(backend.dir, jsonFilename)
    fs.writeFileSync(jsonPath, '{"a": 1, "b":2, "c": 3}')
    await fakeDialog.mock([ { method: 'showOpenDialogSync', value: [jsonPath] } ])
    await click('#chooseBodyFilePath')

    // submit to create a new dataset
    await click('#submit')

    // ensure we have redirected to the workbench section
    await atLocation('#/workbench')

    // ensure we have navigated to the correct dataset
    // TODO (ramfox): it's weird that we have to pass in this newline character
    // to get the reference to match. It looks like because the #dataset-reference
    // div divides the peername and name among multiple divs, we get this odd
    // whitespace character
    const reference = `${username}/\n${jsonDatasetName}`
    await expectTextToBe('#dataset-reference', reference)

    await expectTextToBe('#commit-details-header-entries', '3 entries')

    // enure we are on the history tab
    await onHistoryTab()

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('structure', 'added')
  })

  it('Search: search for a foreign dataset, navigate it, clone it', async () => {
    const {
      atLocation,
      click,
      expectTextToContain,
      waitForExist,
      sendKeys,
      setValue,
      takeScreenshot
    } = utils
    // make sure we are on the collection page
    await click('#collection')
    await atLocation('#/collection')

    // send the "Enter" key to the search bar to activate the search modal
    // await waitForExist('#search-box')
    await click('#search-box')
    await sendKeys('#search-box', "Enter")
    await waitForExist('#search')

    // search for registryDatasetName
    await setValue('#modal-search-box', registryDatasetName)
    await sendKeys('#modal-search-box', "Enter")

    // wait for results to populate
    await waitForExist('#result-0')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('search.png'))
    }

    // check that the results are what we expect them to be
    await expectTextToContain("#result-0 .header a", registryDatasetName)

    // click on #result-0 & get sent to the network preview page
    await click('#result-0 .header a')

    // check location
    // TODO (ramfox): currently broken
    await atLocation('#/network')

    // check we are at the right dataset
    await waitForExist('#navbar-breadcrumb')
    await expectTextToContain('#navbar-breadcrumb', registryDatasetName)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('network-preview.png'))
    }

    // clone the dataset by clicking on the action button
    await click('#sidebar-action')
    await atLocation('#/workbench')

    // flaky tests, they change whether or not the username is so long that the dataset name is cut off by the dataset sidebar.
    // await waitForExist('#dataset-reference')
    // await expectTextToContain('#dataset-reference', registryDatasetName, artifactPath(`search_foreign_dataset_expect_dataset_name.png`))

    // the dataset should be part of the collection
    await click('#collection')
    await atLocation('#/collection')
    const datasets = await app.client.$$('.sidebar-list-item')
    expect(datasets.length).toBe(4)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('collection-with-datasets.png'), 2000)
    }
  })

  it(`clicking 'Network' tab takes you to the feed, navigate to network preview, new commits are foreign`, async () => {
    // ask the temp registry to create another commit on the dataset
    http.get(registryLoc + registryNewCommitAction, (res: http.IncomingMessage) => {
      expect(res.statusCode).toBe(200)
    })

    const {
      click,
      atLocation,
      expectTextToContain,
      waitForNotExist
    } = utils

    // click the Network tab
    await click('#network')
    await atLocation('#/network')

    // there should only be one dataset item in the list
    const recentDatasets = await app.client.$$('.recent-datasets-item')
    expect(recentDatasets.length).toBe(1)

    // ensure we are inspecting the correct dataset & navigate to the preview page
    await expectTextToContain('#recent-0 .header a', registryDatasetName)
    await click('#recent-0 .header a')

    // check we are at the right dataset
    await expectTextToContain('#navbar-breadcrumb ', registryDatasetName)

    // since this dataset has already been cloned, expect NO sidebar action button
    await waitForNotExist('#sidebar-action')

    // there should be two history items
    const historyItems = await app.client.$$('.history-list-item')
    expect(historyItems.length).toBe(2)
  })

  it('search: clicking a local dataset brings you to the workbench', async () => {
    const {
      click,
      sendKeys,
      waitForExist,
      setValue,
      expectTextToBe,
      atLocation,
      takeScreenshot
    } = utils
    // click the search box to bring up the modal
    // send the "Enter" key to the search bar to activate the search modal
    await click('#search-box')
    await sendKeys('#search-box', "Enter")
    await waitForExist('#search')

    // set search scope to 'local' & search for the local dataset
    await click('#switch-local')
    expect(await app.client.$('#switch-local input').getValue()).toBe("on")
    await setValue('#modal-search-box', datasetRename)
    await sendKeys('#modal-search-box', "Enter")

    // wait for results to populate
    await waitForExist('#result-0')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('local-search.png'))
    }

    // check that the results are what we expect them to be
    await expectTextToBe("#result-0 .header a", username + '/' + datasetRename)

    // click on #result-0 & get sent to the network preview page
    await click('#result-0 .header a')

    // check location
    await atLocation('#/workbench')
    // ensure we are on the correct dataset
    await expectTextToBe('#dataset-reference', username + '/\n' + datasetRename)
  })

  it('publishing a dataset adds a dataset to the network feed, unpublishing removes it', async () => {
    const {
      click,
      atLocation,
      expectTextToBe,
      waitForExist,
      takeScreenshot,
      expectTextToContain
    } = utils
    // check location
    await atLocation('#/workbench')
    // ensure we are on the correct dataset
    await expectTextToBe('#dataset-reference', username + '/\n' + datasetRename)

    // click publish
    await click('#publish-button')
    await waitForExist('#submit')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('publish.png'))
    }

    await click('#submit')

    // publish button should change to '#view-in-cloud' button
    await waitForExist('#view-in-cloud')

    // naviate to feed
    await click('#network')
    await atLocation('#/network')

    // should be two recent datasets, dataset username/datasetName should exist
    let recentDatasets = await app.client.$$('.recent-datasets-item')
    expect(recentDatasets.length).toBe(2)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('network-with-published-dataset.png'), 1000)
    }

    // ensure the correct dataset exists
    // Shift+CmdOrCtrl+P
    await waitForExist(`[data-ref="${username}/${datasetRename}"]`)
    await click(`[data-ref="${username}/${datasetRename}"] .header a`)

    await waitForExist('#navbar-breadcrumb')
    await expectTextToContain('#navbar-breadcrumb', datasetRename)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('network-preview-with-local.png'))
    }

    // head back to the workbench & unpublish
    // check location
    await click('#workbench')
    await atLocation('#/workbench')
    // ensure we are on the correct dataset
    await expectTextToBe('#dataset-reference', username + '/\n' + datasetRename)

    // click the hamburger & click the unpublish action
    await click('#workbench-hamburger')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('unpublish-hamburger.png'))
    }

    await click('#hamburger-action-unpublish')
    await click('#submit')

    // publish button should exist again
    await waitForExist('#publish-button')

    // naviate to feed
    await click('#network')
    await atLocation('#/network')

    // should be two recent datasets, dataset username/datasetName should exist
    recentDatasets = await app.client.$$('.recent-datasets-item')
    expect(recentDatasets.length).toBe(1)
  })

  // // remove a dataset is commented out until we have a keyboard command in
  // // place to open the remove modal
  // // we also must create a `keyboard` function that takes a string
  // // and mocks the user typing that string into the keyboard
  // // it must handle both windows and mac defaults (ctrl vs cmd)
  // it('remove a dataset', async () => {
  //   const {
  //     click,
  //     exists,
  //     atLocation,
  //     keyboard
  //   } = utils

  //   // on dataset
  //   await click('#dataset')
  //   // type command (control) shift r to get remove dataset modal
  //   await keyboard('')
  //   // ensure we are on the remove modal
  //   await exists(['#remove'])
  //   // select to remove files
  //   await click('#should-remove-files')
  //   // click submit
  //   await click('#submit')
  //   // end up on collection page
  //   await atLocation('#/collection')
  //   // no datasets
  //   await exists(['#no-datasets'])
  // })
})

async function editCommit (uniqueName: string, component: string, status: 'added' | 'modified' | 'removed', commitTitle: string, commitMessage: string | undefined, utils: E2ETestUtils, imagesDir: string) {
  // remove any illegal characters
  const name = uniqueName.replace(/([^a-z0-9]+)/gi, '-')

  const {
    click,
    waitForExist,
    atLocation,
    setValue,
    takeScreenshot,
    onHistoryTab,
    checkStatus,
    expectTextToBe
  } = utils

  await click('#workbench')
  await atLocation('#/workbench')

  // commit should be enabled
  await waitForExist('.clear-to-commit #commit-status', artifactPathFromDir(imagesDir, `${name}-commit-exists-clear-to-commit.png`))
  // click #commit-status
  await click('#commit-status', artifactPathFromDir(imagesDir, `${name}-commit-click-commit-status.png`))
  // set title and message

  await setValue('#title', commitTitle, artifactPathFromDir(imagesDir, `${name}-commit-set-value-title.png`))
  if (commitMessage) {
    await setValue('#message', commitMessage, artifactPathFromDir(imagesDir, `${name}-commit-set-value-description.png`))
  }

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-commit.png`))
  }
  // submit
  await click('#submit', artifactPathFromDir(imagesDir, `${name}-commit-click-submit.png`))
  // on history tab
  await onHistoryTab(artifactPathFromDir(imagesDir, `${name}-commit-on-history-tab.png`))
  // check component status
  await checkStatus(component, status, artifactPathFromDir(imagesDir, `${name}-commit-check-status-${component}-${status}.png`))
  // commit title should be the same
  await expectTextToBe('#commit-title', commitTitle, artifactPathFromDir(imagesDir, `${name}-commit-expect-text-to-be-commit-title.png`))
  // verify component title and description should be correct
  await click(`#${component}-status`, artifactPathFromDir(imagesDir, `${name}-commit-click-${component}-status.png`))

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-commit-history.png`))
  }
}

async function editMeta (uniqueName: string, dataset: Dataset, status: 'added' | 'modified' | 'removed', utils: E2ETestUtils, imagesDir: string) {
  const name = uniqueName.replace(/([^a-z0-9]+)/gi, '-')
  const {
    delay,
    click,
    waitForExist,
    setValue,
    checkStatus,
    expectTextToBe,
    doesNotExist,
    takeScreenshot,
    sendKeys,
    waitForNotExist
  } = utils

  const { meta, commit } = dataset

  if (!meta || !commit || !commit.title) throw new Error('expected meta and commit to exist when dataset is passed to `editMeta` function')

  // on dataset page
  await click('#workbench', artifactPathFromDir(imagesDir, `${name}-click-workbench.png`))
  // on status tab
  await click('#status-tab', artifactPathFromDir(imagesDir, `${name}-click-status-tab.png`))
  // commit should be disabled
  await doesNotExist('.clear-to-commit #commit-status', artifactPathFromDir(imagesDir, `${name}-commit-does-not-exist-clear-to-commit.png`))
  // click #meta-status
  await click('#meta-status', artifactPathFromDir(imagesDir, `${name}-click-meta-status.png`))
  // set value for title and description
  if (meta.title) {
    await setValue('#title', meta.title, artifactPathFromDir(imagesDir, `${name}-set-value-title.png`))
    await delay(500)
  }
  if (meta.description) {
    await setValue('#description', meta.description, artifactPathFromDir(imagesDir, `${name}-set-value-description.png`))
    await delay(500)
  }

  // add 1 theme, add a 2nd theme, remove the first theme
  if (meta.theme && meta.theme.length > 0) {
    await setValue('#theme-tag-input', 'test')
    await delay(500)
    await sendKeys('#theme-tag-input', "Enter")
    await delay(5000)
    await waitForExist('#theme-tag-0')
    await expectTextToBe('#theme-tag-0', 'test')
    await delay(500)

    await setValue('#theme-tag-input', meta.theme[0])
    await sendKeys('#theme-tag-input', "Enter")
    await delay(500)

    await waitForExist('#theme-tag-1')
    await expectTextToBe('#theme-tag-1', meta.theme[0])

    await click('#theme-tag-0 .tag-remove')
    await waitForNotExist('#theme-tag-1')
    await expectTextToBe('#theme-tag-0', meta.theme[0])
  }

  // set 2 keywords
  if (meta.keywords) {
    if (meta.keywords.length > 0) {
      await setValue('#keywords-tag-input', meta.keywords[0])
      await sendKeys('#keywords-tag-input', "Tab")
      await delay(500)
      await waitForExist('#keywords-tag-0')
      await expectTextToBe('#keywords-tag-0', meta.keywords[0])
    }
    if (meta.keywords.length > 1) {
      await setValue('#keywords-tag-input', meta.keywords[1])
      await sendKeys('#keywords-tag-input', "Tab")
      await delay(500)
      await waitForExist('#keywords-tag-1')
      await expectTextToBe('#keywords-tag-1', meta.keywords[1])
    }
  }

  // NOTE: not testing license because the select component is imported from 'react-select'

  // set Contributors
  if (meta.contributors && meta.contributors.length > 0) {
    await click('#contributors-add-item')
    await waitForExist('#contributors-row-0')
    await setValue('#contributors-row-0 #id-0', meta.contributors[0].id)
    await sendKeys('#contributors-row-0 #id-0', "Tab")
    await delay(500)
    await setValue('#contributors-row-0 #name-0', meta.contributors[0].name)
    await sendKeys('#contributors-row-0 #name-0', "Tab")
    await delay(500)
    await setValue('#contributors-row-0 #email-0', meta.contributors[0].email)
    await sendKeys('#contributors-row-0 #email-0', "Tab")
    await delay(500)
  }

  // set citations row 1
  if (meta.citations && meta.citations.length > 0) {
    await click('#citations-add-item')
    await waitForExist('#citations-row-0')
    await setValue('#citations-row-0 #name-0', 'name - will be removed')
    await sendKeys('#citations-row-0 #name-0', "Tab")
    await delay(500)
    await setValue('#citations-row-0 #url-0', 'url - will be removed')
    await sendKeys('#citations-row-0 #url-0', "Tab")
    await delay(500)
    await setValue('#citations-row-0 #email-0', 'email - will be removed')
    await sendKeys('#citations-row-0 #email-0', "Tab")
    await delay(500)

    // set citations row 2
    await click('#citations-add-item')
    await waitForExist('#citations-row-1')
    await setValue('#citations-row-1 #name-1', meta.citations[0].name)
    await sendKeys('#citations-row-1 #name-1', "Tab")
    await delay(500)
    await setValue('#citations-row-1 #url-1', meta.citations[0].url)
    await sendKeys('#citations-row-1 #url-1', "Tab")
    await delay(500)
    await setValue('#citations-row-1 #email-1', meta.citations[0].email)
    await sendKeys('#citations-row-1 #email-1', "Tab")
    await delay(500)

    // set remove citations row 1
    await click('#citations-remove-row-0')
    await delay(500)
    await waitForNotExist('#citations-row-1')
    await delay(500)
  }

  if (meta.accessURL) {
    // set value for accessURL
    await setValue('#accessURL', meta.accessURL)
    await delay(500)
  }

  if (meta.downloadURL) {
    // set value for downloadURL
    await setValue('#downloadURL', meta.downloadURL)
    await delay(500)
  }

  if (meta.homeURL) {
    // set value for homeURL
    await setValue('#homeURL', meta.homeURL)
    await delay(500)
  }

  if (meta.readmeURL) {
    // set value for readmeURL
    await setValue('#readmeURL', meta.readmeURL)
    await delay(500)
  }

  if (meta.language && meta.language.length > 0) {
    // set value for language
    await setValue('#language-tag-input', meta.language[0])
    await sendKeys('#language-tag-input', "Enter")
    await delay(500)
    await waitForExist('#language-tag-0')
    await expectTextToBe('#language-tag-0', meta.language[0])
  }

  if (meta.accrualPeriodicity) {
    // set value for accrualPeriodicity
    await setValue('#accrualPeriodicity', meta.accrualPeriodicity)
    await delay(500)
  }

  if (meta.version) {
    // set value for version
    await setValue('#version', meta.version)
    await delay(500)
  }

  if (meta.identifier) {
    // set value for identifier
    await setValue('#identifier', meta.identifier)
    await delay(500)
  }

  // check that the status dot is correct
  await checkStatus('meta', status, artifactPathFromDir(imagesDir, `${name}-check-status-${status}.png`))

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-workbench-meta-edit.png`))
  }

  // commit!
  await editCommit('fsi-meta-edit', 'meta', 'added', commit.title, commit.message, utils, imagesDir)

  // check if all non null fields properly exist on page
  if (meta.title) await expectTextToBe('#meta-title', meta.title, artifactPathFromDir(imagesDir, `${name}-commit-expect-text-to-be-meta-title.png`))
  if (meta.description) await expectTextToBe('#meta-description', meta.description, artifactPathFromDir(imagesDir, `${name}-commit-expect-text-to-be-meta-description.png`))
  if (meta.theme && meta.theme.length > 0) {
    await expectTextToBe('#meta-theme', meta.theme.join(''))
  }
  if (meta.keywords && meta.keyworks.length > 0) {
    await expectTextToBe('#meta-keywords', meta.keywords.join(''))
  }
  if (meta.contributors && meta.contributors.length > 0) {
    await expectTextToBe('#meta-contributors .id-0 .keyvalue-table-value', meta.contributors[0].id)
    await expectTextToBe('#meta-contributors .name-0 .keyvalue-table-value', meta.contributors[0].name)
    await expectTextToBe('#meta-contributors .email-0 .keyvalue-table-value', meta.contributors[0].email)
  }
  if (meta.citations && meta.citations.length > 0) {
    await expectTextToBe('#meta-citations .name-0 .keyvalue-table-value', meta.citations[0].name)
    await expectTextToBe('#meta-citations .url-0 .keyvalue-table-value', meta.citations[0].url)
    await expectTextToBe('#meta-citations .email-0 .keyvalue-table-value', meta.citations[0].email)
  }
  if (meta.accessURL) await expectTextToBe('#meta-accessURL', meta.accessURL)
  if (meta.downloadURL) await expectTextToBe('#meta-downloadURL', meta.downloadURL)
  if (meta.homeURL) await expectTextToBe('#meta-homeURL', meta.homeURL)
  if (meta.readmeURL) await expectTextToBe('#meta-readmeURL', meta.readmeURL)
  if (meta.language && meta.language.length > 0) {
    await expectTextToBe('#meta-language', meta.language.join(''))
  }
  if (meta.accrualPeriodicity) await expectTextToBe('#meta-accrualPeriodicity', meta.accrualPeriodicity)
  if (meta.version) await expectTextToBe('#meta-version', meta.version)
  if (meta.identifier) await expectTextToBe('#meta-identifier', meta.identifier)
}

async function editCSVStructure (uniqueName: string, dataset: Dataset, status: 'added' | 'modified' | 'removed', utils: E2ETestUtils, imagesDir: string) {
  const name = uniqueName.replace(/([^a-z0-9]+)/gi, '-')
  const {
    isChecked,
    click,
    delay,
    waitForExist,
    waitForNotExist,
    doesNotExist,
    checkStatus,
    sendKeys,
    setValue,
    expectTextToBe,
    takeScreenshot
  } = utils

  const { structure, commit } = dataset

  if (!structure || !commit || !commit.title) throw new Error('expected structure and commit to exist when dataset is passed to `editStructure` function')
  if (!structure.format || structure.format !== 'csv') throw new Error('expected format to be csv in `editStructure` function')

  const { formatConfig, schema } = structure

  // on dataset page
  await click('#workbench', artifactPathFromDir(imagesDir, `${name}-click-workbench.png`))
  // on status tab
  await click('#status-tab', artifactPathFromDir(imagesDir, `${name}-click-status-tab.png`))
  // commit should be disabled
  await doesNotExist('.clear-to-commit #commit-status', artifactPathFromDir(imagesDir, `${name}-commit-does-not-exist-clear-to-commit.png`))
  // click #structure-status
  await click('#structure-status', artifactPathFromDir(imagesDir, `${name}-click-structure-status.png`))

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-workbench-structure-edit.png`))
  }

  if (formatConfig) {
    const headerRowChecked = await isChecked('#headerRow', artifactPathFromDir(imagesDir, `${name}-is-headerRow-checked.png`))
    const variadicFieldsChecked = await isChecked('#variadicFields', artifactPathFromDir(imagesDir, `${name}-is-variadicFields-checked.png`))
    const lazyQuotesChecked = await isChecked('#lazyQuotes', artifactPathFromDir(imagesDir, `${name}-is-lazyQuotes-checked.png`))
    await delay(1000)

    if ((formatConfig.headerRow && !headerRowChecked) || (!formatConfig.headerRow && headerRowChecked)) {
      await click('#headerRow', artifactPathFromDir(imagesDir, `${name}-click-headerRow.png`))
      await delay(300)
    }
    if ((formatConfig.variadicFields && !variadicFieldsChecked) || !(formatConfig.variadicFields && variadicFieldsChecked)) {
      await click('#variadicFields', artifactPathFromDir(imagesDir, `${name}-click-variadicFields.png`))
      await delay(300)
    }
    if ((formatConfig.lazyQuotes && !lazyQuotesChecked) || !(formatConfig.lazyQuotes && lazyQuotesChecked)) {
      await click('#lazyQuotes', artifactPathFromDir(imagesDir, `${name}-click-lazyQuotes.png`))
      await delay(300)
    }
  }

  if (schema && schema.items && schema.items.items) {
    const schemaItems = schema.items.items

    for (var i = 0; i < schemaItems.length; i++) {
      const item = schemaItems[i]
      if (item.title) {
        await setValue(`#title-${i}`, item.title)
        await sendKeys(`#title-${i}`, "Tab")
        await delay(500)
      }
      if (item.description) {
        await setValue(`#description-${i}`, item.description)
        await sendKeys(`#description-${i}`, "Tab")
        await delay(500)
      }
      if (item.validation) {
        await setValue(`#validation-${i}`, item.validation)
        await sendKeys(`#validation-${i}`, "Tab")
        await delay(500)
      }
    }
  }

  // check that the status dot is correct
  await checkStatus('structure', status, artifactPathFromDir(imagesDir, `${name}-check-status-${status}.png`))

  await editCommit(name, 'structure', 'modified', commit.title, commit.message, utils, imagesDir)

  if (formatConfig) {
    if (formatConfig.headerRow) {
      await waitForExist('#structure-headerRow')
    } else {
      await waitForNotExist('#structure-headerRow')
    }
    if (formatConfig.variadicFields) {
      await waitForExist('#structure-variadicFields')
    } else {
      await waitForNotExist('#structure-variadicFields')
    }
    if (formatConfig.lazyQuotes) {
      await waitForExist('#structure-lazyQuotes')
    } else {
      await waitForNotExist('#structure-lazyQuotes')
    }
  }

  if (schema && schema.items && schema.items.items) {
    const schemaItems = schema.items.items

    for (i = 0; i < schemaItems.length; i++) {
      const item = schemaItems[i]
      if (item.title) await expectTextToBe(`#title-${i}`, item.title)
      if (item.description) await expectTextToBe(`#description-${i}`, item.description)
      if (item.validation) await expectTextToBe(`#validation-${i}`, item.validation)
    }
  }

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-workbench-history-structure.png`))
  }
}

const earthquakeDataset = `time,latitude,longitude,depth,mag,mag_type,nst,gap,dmin,rms,net,id,updated,place,type,horizontal_error,depth_error,mag_error,mag_nst,status,location_source,mag_source\n2019-09-06T17:51:31.610Z,35.809166,-117.6346664,5.74,1.2,ml,14,82,0.0309,0.09,ci,ci38814911,2019-09-06T17:53:36.399Z,"21km N of Ridgecrest, CA",earthquake,0.31,0.69,0.195,7,automatic,ci,ci\n2019-09-06T17:49:30.836Z,63.0001,-149.8869,74.1,1.3,ml,,,,0.67,ak,ak019bg38cop,2019-09-06T17:54:23.895Z,"64km SW of Cantwell, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T17:43:23.350Z,33.7381667,-116.568,25.18,0.96,ml,13,139,0.1248,0.38,ci,ci38814887,2019-09-06T17:47:08.725Z,"10km SSW of Palm Springs, CA",earthquake,1.64,3.17,0.349,17,automatic,ci,ci\n2019-09-06T17:33:55.970Z,35.7791667,-117.5498333,12.91,1.11,ml,6,174,0.05324,0.16,ci,ci38814879,2019-09-06T17:37:39.667Z,"13km W of Searles Valley, CA",earthquake,0.78,1.07,0.041,2,automatic,ci,ci\n2019-09-06T17:33:54.480Z,38.7796669,-122.7388306,0.98,0.23,md,5,193,0.003926,0,nc,nc73266360,2019-09-06T17:42:03.427Z,"2km E of The Geysers, CA",earthquake,2.41,0.65,0.15,3,automatic,nc,nc\n2019-09-06T17:33:30.760Z,35.7018333,-117.5416667,2.3,0.99,ml,18,104,0.0827,0.2,ci,ci38814871,2019-09-06T17:37:16.464Z,"14km WSW of Searles Valley, CA",earthquake,0.31,0.45,0.236,13,automatic,ci,ci\n2019-09-06T17:30:36.330Z,35.645,-117.5403333,4.57,0.99,ml,20,72,0.03278,0.17,ci,ci38814863,2019-09-06T17:34:18.108Z,"12km ENE of Ridgecrest, CA",earthquake,0.31,0.52,0.169,12,automatic,ci,ci\n2019-09-06T17:23:02.230Z,35.6256667,-117.4361667,10.33,0.64,ml,15,111,0.04447,0.2,ci,ci38814847,2019-09-06T17:26:39.064Z,"16km S of Searles Valley, CA",earthquake,0.49,0.69,0.077,8,automatic,ci,ci\n2019-09-06T17:06:30.660Z,35.601,-117.604,1.35,0.86,ml,18,54,0.03534,0.17,ci,ci38814815,2019-09-06T17:10:15.959Z,"7km ESE of Ridgecrest, CA",earthquake,0.26,0.42,0.188,13,automatic,ci,ci\n2019-09-06T17:02:10.700Z,35.6896667,-117.5331667,3.64,0.73,ml,18,100,0.07355,0.14,ci,ci38814807,2019-09-06T17:05:57.887Z,"14km SW of Searles Valley, CA",earthquake,0.29,1.11,0.075,10,automatic,ci,ci\n2019-09-06T16:52:16.417Z,65.1411,-148.939,8.3,1.4,ml,,,,0.52,ak,ak019bg2nd7k,2019-09-06T16:56:20.191Z,"54km NW of Ester, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T16:38:28.240Z,39.4796677,-122.946167,0.77,1.99,md,16,60,0.3031,0.13,nc,nc73266340,2019-09-06T17:04:02.637Z,"8km N of Lake Pillsbury, CA",earthquake,0.43,7.78,0.03,4,automatic,nc,nc\n2019-09-06T16:28:51.784Z,60.29,-143.319,10.9,1.4,ml,,,,0.98,ak,ak019bg2igpi,2019-09-06T16:42:56.504Z,"55km WNW of Cape Yakataga, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T16:23:54.810Z,36.187,-117.9935,1.04,1.11,ml,14,134,0.1319,0.18,ci,ci38814711,2019-09-06T16:27:24.703Z,"11km S of Olancha, CA",earthquake,0.48,0.92,0.138,17,automatic,ci,ci\n2019-09-06T16:15:41.280Z,36.106,-117.8491667,4.06,1.28,ml,19,71,0.01244,0.11,ci,ci38814703,2019-09-06T16:19:25.645Z,"11km NE of Coso Junction, CA",earthquake,0.2,0.28,0.264,19,automatic,ci,ci\n2019-09-06T16:15:03.350Z,38.8434982,-122.8301697,2.25,0.57,md,7,164,0.006424,0.01,nc,nc73266335,2019-09-06T16:42:02.396Z,"10km WNW of Cobb, CA",earthquake,1.49,2.79,,1,automatic,nc,nc\n2019-09-06T16:11:19.480Z,35.701,-117.5325,9.15,1.39,ml,26,73,0.08424,0.17,ci,ci38814695,2019-09-06T16:21:47.040Z,"14km WSW of Searles Valley, CA",earthquake,0.3,0.79,0.165,20,automatic,ci,ci\n2019-09-06T16:10:48.203Z,31.3391,-103.0897,5,2.9,mb_lg,,45,0.127,0.69,us,us70005cut,2019-09-06T16:38:21.040Z,"33km SSW of Monahans, Texas",earthquake,0.9,1.6,0.088,34,reviewed,us,us\n2019-09-06T16:09:20.816Z,62.1752,-152.3258,5.7,1.4,ml,,,,0.88,ak,ak019bg2ebp3,2019-09-06T16:13:38.854Z,"116km W of Talkeetna, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T15:57:00.880Z,38.8188324,-122.7646637,2.1,1.14,md,14,61,0.01232,0.03,nc,nc73266330,2019-09-06T16:20:04.218Z,"4km W of Cobb, CA",earthquake,0.27,0.57,0.11,5,automatic,nc,nc\n2019-09-06T15:55:09.944Z,31.3294,-103.0896,5,3.1,mb_lg,,45,0.117,0.71,us,us70005cul,2019-09-06T16:40:10.040Z,"34km SSW of Monahans, Texas",earthquake,1.2,1.7,0.068,57,reviewed,us,us\n2019-09-06T15:51:39.760Z,62.1314,-151.676,107.1,1.7,ml,,,,0.67,ak,ak019bg21xl5,2019-09-06T16:04:46.098Z,"84km WSW of Talkeetna, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T15:51:38.630Z,32.8243333,-115.4688333,11.43,2.34,ml,29,44,0.02653,0.28,ci,ci38814663,2019-09-06T15:55:33.513Z,"8km W of Holtville, CA",earthquake,0.42,0.74,0.222,28,automatic,ci,ci\n2019-09-06T15:46:35.994Z,63.4836,-146.0184,0,1.7,ml,,,,0.81,ak,ak019bg20urk,2019-09-06T16:04:45.732Z,"58km SW of Deltana, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T15:43:52.745Z,61.3871,-152.3036,26.9,0.6,ml,,,,1.01,ak,ak019bg208zt,2019-09-06T16:04:45.348Z,"95km NW of Nikiski, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T15:31:35.172Z,59.6792,-143.9137,27.7,1.9,ml,,,,1.2,ak,ak019bg1xlr0,2019-09-06T15:34:56.849Z,"93km WSW of Cape Yakataga, Alaska",earthquake,,1,,,automatic,ak,ak\n2019-09-06T15:31:32.060Z,32.8193333,-115.4603333,7.68,1.22,ml,13,62,0.01804,0.22,ci,ci38814647,2019-09-06T15:35:19.380Z,"8km W of Holtville, CA",earthquake,0.81,0.87,0.203,9,automatic,ci,ci\n2019-09-06T15:27:56.449Z,-20.1971,169.0722,29.11,5.9,mww,,42,2.841,1.3,us,us70005cu5,2019-09-06T17:39:00.306Z,"74km SSW of Isangel, Vanuatu",earthquake,7.6,3.4,0.058,29,reviewed,us,us\n2019-09-06T15:20:20.079Z,36.25183333,-98.64933333,7.7,1.93,ml,21,199,0.1196765154,0.09,ok,ok2019rmgz,2019-09-06T15:27:59.129Z,"15km W of Fairview, Oklahoma",earthquake,,0.3,0.31,5,reviewed,ok,ok\n2019-09-06T15:16:16.286Z,60.3614,-141.4365,5.6,1.5,ml,,,,1.13,ak,ak019bg1udev,2019-09-06T15:20:13.085Z,"64km ENE of Cape Yakataga, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T15:15:25.255Z,68.9842,-146.9774,0,1.7,ml,,,,1.1,ak,ak019bg1u6q9,2019-09-06T15:20:12.615Z,"112km NNW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T15:10:31.270Z,35.6595,-117.5145,5.64,0.71,ml,17,83,0.0581,0.21,ci,ci38814615,2019-09-06T15:14:15.255Z,"15km ENE of Ridgecrest, CA",earthquake,0.46,31.61,0.056,7,automatic,ci,ci\n2019-09-06T15:03:19.930Z,38.8256683,-122.8006668,3.24,0.83,md,15,66,0.007691,0.02,nc,nc73266300,2019-09-06T15:23:02.807Z,"7km NW of The Geysers, CA",earthquake,0.3,0.71,0.06,2,automatic,nc,nc\n2019-09-06T14:57:47.330Z,35.6971667,-117.4836667,6.37,1.54,ml,27,62,0.09761,0.17,ci,ci38814575,2019-09-06T15:01:35.917Z,"11km SW of Searles Valley, CA",earthquake,0.26,0.92,0.205,25,automatic,ci,ci\n2019-09-06T14:57:01.130Z,35.714,-117.5458333,8.07,1.56,ml,29,51,0.0937,0.19,ci,ci38814567,2019-09-06T15:08:26.770Z,"14km WSW of Searles Valley, CA",earthquake,0.26,0.93,0.111,24,automatic,ci,ci\n2019-09-06T14:51:06.645Z,68.9699,-146.7614,0.9,1.8,ml,,,,0.85,ak,ak019bg1gfkx,2019-09-06T14:55:46.335Z,"106km NNW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T14:48:26.810Z,35.8578333,-117.6781667,7.37,0.31,ml,10,84,0.07784,0.11,ci,ci38814551,2019-09-06T14:52:00.921Z,"22km ESE of Little Lake, CA",earthquake,0.29,1.11,0.095,4,automatic,ci,ci\n2019-09-06T14:46:48.150Z,36.0893333,-117.8488333,2.34,0.89,ml,12,148,0.02861,0.14,ci,ci38814543,2019-09-06T14:50:25.585Z,"10km ENE of Coso Junction, CA",earthquake,0.45,0.26,0.246,11,automatic,ci,ci\n2019-09-06T14:25:28.620Z,45.861,-111.364,4.94,1.59,ml,15,112,0.308,0.22,mb,mb80359834,2019-09-06T14:45:55.280Z,"2km WNW of Manhattan, Montana",earthquake,0.54,4.54,0.058,6,reviewed,mb,mb\n2019-09-06T14:25:27.180Z,37.3521652,-122.0181656,21.42,1.24,md,5,142,,0.06,nc,nc73266280,2019-09-06T16:32:03.333Z,"2km SSE of Sunnyvale, CA",earthquake,1.27,1.75,0.19,4,automatic,nc,nc\n2019-09-06T14:06:15.510Z,35.6761667,-117.5148333,10.05,2.75,ml,40,38,0.06979,0.15,ci,ci38814519,2019-09-06T14:17:15.390Z,"14km SW of Searles Valley, CA",earthquake,0.21,0.41,0.199,26,automatic,ci,ci\n2019-09-06T14:01:37.926Z,68.8306,-146.269,2.6,1.8,ml,,,,0.4,ak,ak019bg15s2o,2019-09-06T14:07:04.196Z,"84km NNW of Arctic Village, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T13:56:10.551Z,68.7081,-147.0643,0,2.3,ml,,,,0.81,ak,ak019bg0w2qn,2019-09-06T14:02:42.406Z,"90km NW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T13:55:01.850Z,38.7811661,-122.7440033,0.4,0.16,md,7,111,0.006053,0.05,nc,nc73266265,2019-09-06T15:49:02.957Z,"1km ENE of The Geysers, CA",earthquake,0.42,1.72,0.08,2,automatic,nc,nc\n2019-09-06T13:54:01.960Z,19.4501667,-155.2949982,0.13,1.97,ml,11,277,0.02927,0.24,hv,hv71128362,2019-09-06T13:59:50.720Z,"6km WNW of Volcano, Hawaii",earthquake,0.76,0.55,0.45,4,automatic,hv,hv\n2019-09-06T13:50:35.389Z,60.212,-152.4047,98.7,1.4,ml,,,,0.61,ak,ak019bg0uubz,2019-09-06T13:59:20.714Z,"35km SSE of Redoubt Volcano, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T13:45:16.290Z,35.7743333,-117.6006667,14.63,1.01,ml,17,108,0.0414,0.23,ci,ci38814511,2019-09-06T13:48:56.237Z,"18km W of Searles Valley, CA",earthquake,0.73,1.16,0.206,11,automatic,ci,ci\n2019-09-06T13:32:25.220Z,35.8508333,-117.6745,7.81,1.36,ml,21,83,0.07169,0.2,ci,ci38814495,2019-09-06T13:36:06.163Z,"23km ESE of Little Lake, CA",earthquake,0.35,0.95,0.205,18,automatic,ci,ci\n2019-09-06T13:31:24.410Z,35.6765,-117.5495,7.21,0.8,ml,13,111,0.05664,0.18,ci,ci38814487,2019-09-06T13:35:02.189Z,"13km ENE of Ridgecrest, CA",earthquake,0.41,0.82,0.108,11,automatic,ci,ci\n2019-09-06T13:19:36.789Z,36.47983333,-98.73133333,8.71,0.48,ml,13,123,0.008998234239,0.05,ok,ok2019rmdd,2019-09-06T14:10:04.919Z,"32km NW of Fairview, Oklahoma",earthquake,,0.3,0.16,4,reviewed,ok,ok\n2019-09-06T13:19:17.425Z,63.4992,-149.5741,104,2.4,ml,,,,0.7,ak,ak019bg0o5q5,2019-09-06T13:29:43.041Z,"33km WNW of Cantwell, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T13:04:58.333Z,65.1099,-148.8274,12.6,1.1,ml,,,,0.84,ak,ak019bg0l170,2019-09-06T13:09:36.330Z,"48km NW of Ester, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T12:58:11.634Z,63.2055,-151.1012,0,1.4,ml,,,,0.62,ak,ak019bg0b2nf,2019-09-06T13:01:43.647Z,"109km W of Cantwell, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T12:56:23.680Z,46.8686667,-112.5231667,11.53,1.02,ml,9,101,0.179,0.09,mb,mb80359819,2019-09-06T14:19:30.350Z,"15km SE of Lincoln, Montana",earthquake,0.49,1.21,0.132,2,reviewed,mb,mb\n2019-09-06T12:56:05.520Z,36.779335,-120.8694992,3.08,2.22,md,24,153,0.1313,0.1,nc,nc73266250,2019-09-06T15:22:02.800Z,"28km SW of South Dos Palos, CA",earthquake,0.46,1.1,0.12,15,automatic,nc,nc\n2019-09-06T12:54:33.400Z,35.5281667,-117.3955,6.22,1.09,ml,19,66,0.02546,0.18,ci,ci38814455,2019-09-06T12:58:21.918Z,"26km S of Trona, CA",earthquake,0.38,0.71,0.145,17,automatic,ci,ci\n2019-09-06T12:52:47.301Z,58.7858,-154.9127,145.2,2.4,ml,,,,0.6,ak,ak019bg09v3u,2019-09-06T12:59:02.659Z,"101km E of King Salmon, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T12:44:32.210Z,35.6565,-117.4515,4.7,1.16,ml,21,59,0.02423,0.16,ci,ci38814447,2019-09-06T12:48:16.856Z,"13km SSW of Searles Valley, CA",earthquake,0.29,0.48,0.177,16,automatic,ci,ci\n2019-09-06T12:43:46.247Z,61.3552,-150.0878,36.5,2,ml,,,,0.75,ak,ak019bg07xii,2019-09-06T12:55:41.096Z,"18km NNW of Anchorage, Alaska",earthquake,,0.9,,,automatic,ak,ak\n2019-09-06T12:41:28.123Z,61.8922,-149.6081,4.9,0.9,ml,,,,0.51,ak,ak019bg07gr0,2019-09-06T12:45:16.797Z,"25km NW of Fishhook, Alaska",earthquake,,0.9,,,automatic,ak,ak\n2019-09-06T12:38:12.780Z,35.7833333,-117.6536667,8.26,1.46,ml,25,52,0.05594,0.17,ci,ci38814439,2019-09-06T12:41:59.120Z,"18km N of Ridgecrest, CA",earthquake,0.22,0.68,0.185,21,automatic,ci,ci\n2019-09-06T12:33:31.200Z,35.8553352,-117.685997,6.85,1.04,ml,15,78,0.07929,0.05,ci,ci38814423,2019-09-06T12:37:00.790Z,"22km ESE of Little Lake, CA",earthquake,0.32,1.04,0.142,5,automatic,ci,ci\n2019-09-06T12:30:30.930Z,35.8116667,-117.6378333,4.43,0.42,ml,8,71,0.03303,0.12,ci,ci38814407,2019-09-06T12:34:12.772Z,"22km N of Ridgecrest, CA",earthquake,0.32,0.55,0.131,5,automatic,ci,ci\n2019-09-06T12:20:45.490Z,38.8343315,-122.7891693,1.67,0.41,md,7,99,0.004174,0.01,nc,nc73266240,2019-09-06T12:42:03.652Z,"6km WNW of Cobb, CA",earthquake,0.62,0.5,0.16,2,automatic,nc,nc\n2019-09-06T12:20:14.508Z,63.2194,-151.0169,3.8,1.8,ml,,,,0.73,ak,ak019bg02xnw,2019-09-06T12:24:32.087Z,"105km W of Cantwell, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T12:19:43.340Z,35.9011667,-117.7011667,9.24,1.16,ml,21,85,0.06224,0.1,ci,ci38814399,2019-09-06T12:23:19.602Z,"19km ESE of Little Lake, CA",earthquake,0.21,0.49,0.203,16,automatic,ci,ci\n2019-09-06T12:08:51.440Z,38.7784996,-122.7220001,1.33,0.46,md,6,102,0.01244,0.02,nc,nc73266235,2019-09-06T12:31:02.593Z,"3km W of Anderson Springs, CA",earthquake,0.84,2.15,0.3,2,automatic,nc,nc\n2019-09-06T12:03:57.929Z,60.0194,-152.6083,97.6,1.8,ml,,,,0.69,ak,ak019bfzzdt6,2019-09-06T12:10:19.002Z,"51km WNW of Anchor Point, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T12:02:24.643Z,3.8946,126.4531,73.62,4.8,mb,,105,3.233,0.81,us,us70005cr0,2019-09-06T12:41:09.040Z,"199km SSE of Sarangani, Philippines",earthquake,5.7,8.6,0.079,49,reviewed,us,us\n2019-09-06T12:01:29.290Z,37.6263351,-118.8586655,7.75,1.02,md,8,129,0.008082,0.04,nc,nc73266230,2019-09-06T14:40:03.398Z,"11km E of Mammoth Lakes, CA",earthquake,2.25,2.27,0.14,9,automatic,nc,nc\n2019-09-06T11:54:16.860Z,35.8566667,-117.6933333,5.5,1.42,ml,29,47,0.0754,0.16,ci,ci38814375,2019-09-06T12:04:43.000Z,"21km ESE of Little Lake, CA",earthquake,0.2,0.77,0.185,24,automatic,ci,ci\n2019-09-06T11:50:25.980Z,32.8103333,-115.4551667,12.34,1.66,ml,22,48,0.008646,0.25,ci,ci37426741,2019-09-06T16:10:41.589Z,"7km W of Holtville, CA",earthquake,0.39,0.64,0.231,27,reviewed,ci,ci\n2019-09-06T11:50:22.590Z,32.8071667,-115.4506667,9.47,1.02,ml,13,117,0.003748,0.22,ci,ci38814367,2019-09-06T15:42:03.420Z,"7km W of Holtville, CA",earthquake,0.77,1.15,0.068,3,reviewed,ci,ci\n2019-09-06T11:49:23.800Z,35.6121667,-117.4676667,9.31,0.97,ml,18,64,0.02392,0.19,ci,ci38814359,2019-09-06T11:52:54.517Z,"18km SSW of Searles Valley, CA",earthquake,0.4,0.61,0.264,7,automatic,ci,ci\n2019-09-06T11:45:59.430Z,36.9196663,-121.6399994,6.37,1.48,md,13,107,0.02081,0.08,nc,nc73266225,2019-09-06T14:14:04.253Z,"4km N of Aromas, CA",earthquake,0.47,0.61,0.11,10,automatic,nc,nc\n2019-09-06T11:45:43.030Z,35.7383333,-117.6028333,13.92,0.64,ml,12,126,0.07736,0.32,ci,ci38814351,2019-09-06T11:49:19.378Z,"15km NNE of Ridgecrest, CA",earthquake,0.95,1.6,0.279,9,automatic,ci,ci\n2019-09-06T11:45:09.740Z,35.8308333,-117.658,3,0.44,ml,8,81,0.05141,0.11,ci,ci38814343,2019-09-06T11:48:43.493Z,"23km N of Ridgecrest, CA",earthquake,0.26,0.34,0.16,7,automatic,ci,ci\n2019-09-06T11:42:51.150Z,35.7828331,-117.6261673,11.04,0.76,ml,9,194,0.04026,0.04,ci,ci38814327,2019-09-06T11:46:18.480Z,"19km NNE of Ridgecrest, CA",earthquake,0.83,1.78,0.228,7,automatic,ci,ci\n2019-09-06T11:42:00.960Z,35.6963333,-117.4933333,4.99,0.96,ml,16,138,0.0647,0.17,ci,ci38814319,2019-09-06T11:45:33.473Z,"11km SW of Searles Valley, CA",earthquake,0.4,0.67,0.171,11,automatic,ci,ci\n2019-09-06T11:39:22.790Z,35.7996667,-117.6355,5.82,0.91,ml,23,64,0.0348,0.18,ci,ci38814311,2019-09-06T11:43:12.489Z,"20km N of Ridgecrest, CA",earthquake,0.28,0.73,0.169,11,automatic,ci,ci\n2019-09-06T11:29:34.490Z,35.8203333,-117.6048333,2.5,0.94,ml,10,107,0.007512,0.19,ci,ci38814295,2019-09-06T11:33:08.487Z,"19km WNW of Searles Valley, CA",earthquake,0.71,0.39,0.13,12,automatic,ci,ci\n2019-09-06T11:27:59.124Z,68.6709,-146.7293,7.9,1.8,ml,,,,0.43,ak,ak019bfzj3ig,2019-09-06T11:37:41.567Z,"77km NW of Arctic Village, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T11:27:10.210Z,36.2166667,-118.1753333,-0.26,1.05,ml,18,110,0.2356,0.26,ci,ci38814287,2019-09-06T11:30:51.803Z,"17km WSW of Olancha, CA",earthquake,0.58,31.61,0.101,11,automatic,ci,ci\n2019-09-06T11:15:18.050Z,35.79666667,-96.68616667,7.34,0.99,ml,27,96,0.1385728073,0.16,ok,ok2019rlza,2019-09-06T14:18:14.480Z,"5km NNW of Stroud, Oklahoma",earthquake,,0.5,0.14,11,reviewed,ok,ok\n2019-09-06T11:14:20.260Z,35.7801667,-117.6015,4.78,0.82,ml,16,108,0.03565,0.19,ci,ci38814271,2019-09-06T11:18:02.299Z,"18km W of Searles Valley, CA",earthquake,0.49,0.64,0.133,10,automatic,ci,ci\n2019-09-06T11:14:03.054Z,62.6099,-150.6314,75.2,2.5,ml,,,,0.66,ak,ak019bfzg6u4,2019-09-06T11:18:06.551Z,"41km NW of Talkeetna, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T11:11:39.386Z,60.2679,-141.6463,0.1,1.3,ml,,,,0.89,ak,ak019bfzfmbu,2019-09-06T11:16:25.358Z,"49km ENE of Cape Yakataga, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T11:01:33.460Z,33.1425,-116.0993333,8.95,0.95,ml,27,56,0.05901,0.25,ci,ci38814263,2019-09-06T11:05:12.299Z,"3km E of Ocotillo Wells, CA",earthquake,0.44,1.52,0.184,15,automatic,ci,ci\n2019-09-06T10:55:37.990Z,35.706,-117.5616667,2.51,1.55,ml,29,59,0.084,0.14,ci,ci38814255,2019-09-06T11:06:19.680Z,"14km NE of Ridgecrest, CA",earthquake,0.19,0.34,0.15,26,automatic,ci,ci\n2019-09-06T10:41:19.250Z,36.6136665,-121.1171646,9.43,1.32,md,11,130,0.06907,0.24,nc,nc73266200,2019-09-06T13:20:02.891Z,"9km NNE of Pinnacles, CA",earthquake,1.01,2.2,0.19,8,automatic,nc,nc\n2019-09-06T10:37:55.213Z,-18.0516,167.5929,10,4.9,mb,,102,2.616,0.81,us,us70005cqu,2019-09-06T11:00:36.040Z,"84km WSW of Port-Vila, Vanuatu",earthquake,8.3,1.9,0.072,61,reviewed,us,us\n2019-09-06T10:35:13.410Z,35.669,-117.511,11.36,0.51,ml,8,241,0.0666,0.1,ci,ci38814239,2019-09-06T10:38:47.396Z,"15km SW of Searles Valley, CA",earthquake,0.68,0.93,0.067,7,automatic,ci,ci\n2019-09-06T10:32:59.548Z,13.8207,120.5642,139.07,4.9,mb,,59,8.826,0.86,us,us70005cqr,2019-09-06T14:43:07.511Z,"7km W of Calatagan, Philippines",earthquake,9.3,7.5,0.043,169,reviewed,us,us\n2019-09-06T10:32:42.070Z,35.8883333,-117.7073333,5.54,1.35,ml,24,68,0.0753,0.14,ci,ci38814231,2019-09-06T10:43:08.990Z,"19km ESE of Little Lake, CA",earthquake,0.21,0.74,0.175,20,automatic,ci,ci\n2019-09-06T10:30:25.027Z,61.489,-149.9204,36,1.4,ml,,,,0.61,ak,ak019bfyy8fa,2019-09-06T10:46:28.699Z,"4km SSE of Big Lake, Alaska",earthquake,,1.1,,,automatic,ak,ak\n2019-09-06T10:26:17.780Z,34.014,-117.5248333,3.02,0.77,ml,17,56,0.03196,0.24,ci,ci38814223,2019-09-06T10:30:05.999Z,"2km NNW of Mira Loma, CA",earthquake,0.38,0.48,0.151,20,automatic,ci,ci\n2019-09-06T10:25:21.750Z,38.8238335,-122.7978363,2.46,1.36,md,28,32,0.009569,0.05,nc,nc73266180,2019-09-06T12:26:02.564Z,"6km NW of The Geysers, CA",earthquake,0.21,0.4,0.18,7,automatic,nc,nc\n2019-09-06T10:25:09.420Z,37.6181679,-118.8588333,7.57,2.73,md,23,88,0.003373,0.05,nc,nc73266175,2019-09-06T13:56:12.407Z,"11km E of Mammoth Lakes, CA",earthquake,0.49,0.8,0.19,28,automatic,nc,nc\n2019-09-06T10:22:28.190Z,37.6193352,-118.8573303,7.65,1.25,md,11,205,0.004478,0.02,nc,nc73266165,2019-09-06T11:44:03.306Z,"11km E of Mammoth Lakes, CA",earthquake,1.8,1.54,0.16,10,automatic,nc,nc\n2019-09-06T10:21:32.820Z,37.6235008,-118.8619995,6.69,1.63,md,15,120,0.004564,0.03,nc,nc73266160,2019-09-06T11:18:03.131Z,"10km E of Mammoth Lakes, CA",earthquake,1.01,1.13,0.18,14,automatic,nc,nc\n2019-09-06T10:19:55.831Z,62.7231,-152.1668,20.3,1.3,ml,,,,0.72,ak,ak019bfyvxxb,2019-09-06T10:23:23.213Z,"114km WNW of Talkeetna, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T10:09:48.760Z,21.184,94.6497,98.86,4.8,mb,,50,1.748,0.96,us,us70005cqm,2019-09-06T10:29:42.040Z,"37km NNW of Chauk, Burma",earthquake,7.2,6.9,0.058,92,reviewed,us,us\n2019-09-06T10:09:28.620Z,36.1016667,-117.8485,2.76,1.47,ml,17,117,0.01669,0.1,ci,ci38814199,2019-09-06T10:13:10.901Z,"11km NE of Coso Junction, CA",earthquake,0.22,0.42,0.196,22,automatic,ci,ci\n2019-09-06T10:06:58.056Z,59.4728,-139.1073,0,1.9,ml,,,,0.9,ak,ak019bfyt5ul,2019-09-06T10:12:10.691Z,"36km ESE of Yakutat, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T10:02:18.290Z,35.8903333,-117.713,9.2,0.61,ml,13,65,0.0767,0.1,ci,ci38814191,2019-09-06T10:06:00.420Z,"18km ESE of Little Lake, CA",earthquake,0.22,0.67,0.19,6,automatic,ci,ci\n2019-09-06T10:01:00.320Z,37.8510017,-122.2464981,11.95,1.2,md,13,74,0.02402,0.05,nc,nc73266155,2019-09-06T10:51:04.968Z,"3km NNW of Piedmont, CA",earthquake,0.47,1,0.14,9,automatic,nc,nc\n2019-09-06T09:46:50.670Z,33.1431667,-116.5068333,7.04,0.8,ml,18,78,0.0982,0.18,ci,ci38814175,2019-09-06T09:50:24.676Z,"11km NE of Julian, CA",earthquake,0.42,0.69,0.228,8,automatic,ci,ci\n2019-09-06T09:43:07.461Z,58.289,-154.9848,1.1,1.6,ml,,,,0.41,ak,ak019bfyfjru,2019-09-06T09:46:14.998Z,"102km NW of Larsen Bay, Alaska",earthquake,,0.9,,,automatic,ak,ak\n2019-09-06T09:29:35.003Z,60.1926,-151.2694,49.7,1.4,ml,,,,0.55,ak,ak019bfyclv2,2019-09-06T09:33:32.281Z,"19km S of Cohoe, Alaska",earthquake,,1.2,,,automatic,ak,ak\n2019-09-06T09:25:43.310Z,36.2253333,-117.9153333,1.51,0.79,ml,12,170,0.1181,0.14,ci,ci38814167,2019-09-06T14:10:38.416Z,"10km SE of Olancha, CA",earthquake,0.38,0.6,0.122,7,reviewed,ci,ci\n2019-09-06T09:22:28.930Z,35.7128333,-117.5525,10.89,0.54,ml,11,159,0.0916,0.08,ci,ci38814159,2019-09-06T09:26:15.303Z,"15km WSW of Searles Valley, CA",earthquake,0.37,0.6,0.181,7,automatic,ci,ci\n2019-09-06T09:17:56.680Z,35.9781667,-117.6608333,2.91,0.52,ml,7,179,0.03137,0.14,ci,ci38814151,2019-09-06T09:21:28.680Z,"23km ENE of Little Lake, CA",earthquake,0.77,0.64,0.152,5,automatic,ci,ci\n2019-09-06T09:16:23.450Z,35.3756667,-117.8311667,3.33,0.95,ml,16,100,0.1087,0.21,ci,ci38814143,2019-09-06T14:10:40.489Z,"18km W of Johannesburg, CA",earthquake,0.37,1.6,0.168,12,reviewed,ci,ci\n2019-09-06T09:15:29.490Z,35.7793333,-117.5745,5.7,0.59,ml,11,136,0.04086,0.13,ci,ci38814135,2019-09-06T09:19:08.961Z,"15km W of Searles Valley, CA",earthquake,0.4,0.64,0.171,8,automatic,ci,ci\n2019-09-06T09:13:26.680Z,35.871,-117.6881667,0.76,0.87,ml,12,79,0.08264,0.19,ci,ci38814127,2019-09-06T09:17:00.561Z,"21km ESE of Little Lake, CA",earthquake,0.33,0.73,0.136,12,automatic,ci,ci\n2019-09-06T09:12:35.850Z,35.8193333,-117.618,7.94,0.73,ml,10,79,0.01703,0.15,ci,ci38814119,2019-09-06T09:16:21.064Z,"20km WNW of Searles Valley, CA",earthquake,0.41,0.7,0.128,7,automatic,ci,ci\n2019-09-06T09:09:07.355Z,62.4587,-151.015,108.7,1,ml,,,,0.76,ak,ak019bfy89c2,2019-09-06T09:12:37.362Z,"49km WNW of Talkeetna, Alaska",earthquake,,1.4,,,automatic,ak,ak\n2019-09-06T09:05:07.510Z,32.8246667,-115.4665,7.45,1.35,ml,14,50,0.02545,0.17,ci,ci38814103,2019-09-06T09:08:37.516Z,"8km W of Holtville, CA",earthquake,0.45,0.7,0.168,18,automatic,ci,ci\n2019-09-06T08:59:54.813Z,35.8306,31.736,59.6,4.2,mb,,123,1.565,0.5,us,us70005cpr,2019-09-06T09:15:46.040Z,"71km SW of Gazipasa, Turkey",earthquake,6.8,7.6,0.159,11,reviewed,us,us\n2019-09-06T08:57:21.248Z,63.4779,-151.2954,9.6,1.3,ml,,,,0.66,ak,ak019bfxx599,2019-09-06T09:03:25.184Z,"117km W of Cantwell, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T08:55:20.950Z,32.818,-115.4576667,8.17,1.69,ml,21,45,0.01561,0.26,ci,ci38814095,2019-09-06T08:59:07.895Z,"7km W of Holtville, CA",earthquake,0.55,0.99,0.235,24,automatic,ci,ci\n2019-09-06T08:54:06.850Z,32.8275,-115.4603333,7.28,1.61,ml,19,63,0.02489,0.3,ci,ci38814087,2019-09-06T08:57:47.581Z,"8km WNW of Holtville, CA",earthquake,0.63,1.02,0.246,27,automatic,ci,ci\n2019-09-06T08:46:26.450Z,35.7258333,-117.5785,12.89,0.89,ml,18,120,0.09104,0.26,ci,ci38814079,2019-09-06T08:49:54.532Z,"15km NE of Ridgecrest, CA",earthquake,0.53,1.18,0.206,9,automatic,ci,ci\n2019-09-06T08:36:38.391Z,62.4291,-149.181,42.7,1.4,ml,,,,0.89,ak,ak019bfxsok3,2019-09-06T08:49:21.306Z,"45km NE of Y, Alaska",earthquake,,1,,,automatic,ak,ak\n2019-09-06T08:36:26.236Z,65.1471,-148.6816,13,1.7,ml,,,,0.99,ak,ak019bfxsnqo,2019-09-06T08:40:38.750Z,"45km NW of Ester, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T08:35:02.480Z,33.5518333,-118.3536667,-0.18,1.79,ml,29,136,0.1581,0.31,ci,ci38814071,2019-09-06T15:23:50.420Z,"21km SSW of San Pedro, CA",earthquake,0.4,0.72,0.135,42,reviewed,ci,ci\n2019-09-06T08:34:51.869Z,35.501,-97.16133333,7.76,1.5,ml,38,52,0.1016800469,0.15,ok,ok2019rltt,2019-09-06T13:35:25.320Z,"1km N of Harrah, Oklahoma",earthquake,,0.5,0.22,8,reviewed,ok,ok\n2019-09-06T08:22:20.920Z,34.196,-117.5435,7.66,0.8,ml,13,88,0.1045,0.12,ci,ci38814055,2019-09-06T14:11:03.283Z,"8km SSW of Lytle Creek, CA",earthquake,0.32,0.94,0.315,15,reviewed,ci,ci\n2019-09-06T08:21:57.818Z,-29.7257,-71.6898,31.65,4.1,mb,,160,0.436,0.55,us,us70005cpc,2019-09-06T16:24:34.103Z,"41km NW of Coquimbo, Chile",earthquake,3.4,7.2,0.197,7,reviewed,us,us\n2019-09-06T08:14:17.020Z,35.7245,-117.5328333,8.29,1.13,ml,27,73,0.1051,0.16,ci,ci38814047,2019-09-06T08:17:55.531Z,"13km WSW of Searles Valley, CA",earthquake,0.29,0.84,0.137,16,automatic,ci,ci\n2019-09-06T08:13:25.640Z,35.6575,-117.566,6.89,0.91,ml,21,91,0.03547,0.16,ci,ci38814039,2019-09-06T08:17:10.325Z,"11km ENE of Ridgecrest, CA",earthquake,0.32,0.61,0.163,12,automatic,ci,ci\n2019-09-06T08:06:40.030Z,35.6851667,-117.5023333,9.28,1.58,ml,28,67,0.06709,0.15,ci,ci38814031,2019-09-06T08:17:24.880Z,"13km SW of Searles Valley, CA",earthquake,0.28,0.55,0.179,26,automatic,ci,ci\n2019-09-06T08:05:36.930Z,36.5536652,-121.1461639,6.68,1.93,md,21,128,0.03636,0.11,nc,nc73266140,2019-09-06T10:00:04.602Z,"2km N of Pinnacles, CA",earthquake,0.34,0.82,0.2,20,automatic,nc,nc\n2019-09-06T08:03:17.130Z,34.0491667,-116.4013333,7.01,1.95,ml,60,34,0.02221,0.19,ci,ci38814023,2019-09-06T08:14:21.870Z,"8km SSE of Yucca Valley, CA",earthquake,0.21,0.49,0.125,26,automatic,ci,ci\n2019-09-06T08:00:22.049Z,63.3233,-145.1008,0,1.6,ml,,,,0.81,ak,ak019bfxkxi4,2019-09-06T08:05:11.236Z,"61km S of Deltana, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T08:00:02.510Z,35.753,-117.5531667,7.85,1.99,ml,32,117,0.07225,0.23,ci,ci38814015,2019-09-06T08:03:55.246Z,"14km W of Searles Valley, CA",earthquake,0.39,1,0.194,26,automatic,ci,ci\n2019-09-06T07:55:16.860Z,35.6531667,-117.5445,7.49,0.62,ml,15,92,0.03697,0.18,ci,ci38814007,2019-09-06T07:58:52.213Z,"12km ENE of Ridgecrest, CA",earthquake,0.44,0.78,0.116,8,automatic,ci,ci\n2019-09-06T07:47:41.950Z,36.2143333,-118.1618333,2.09,1.05,ml,17,107,0.2346,0.19,ci,ci38813991,2019-09-06T07:51:14.163Z,"16km WSW of Olancha, CA",earthquake,0.39,2.24,0.125,11,automatic,ci,ci\n2019-09-06T07:45:48.870Z,38.8121681,-122.8026657,3.84,0.55,md,14,112,0.007119,0.04,nc,nc73266120,2019-09-06T08:00:03.740Z,"6km NW of The Geysers, CA",earthquake,0.51,0.75,0.03,3,automatic,nc,nc\n2019-09-06T07:45:08.800Z,32.8126667,-115.461,6.29,1.35,ml,12,70,0.01403,0.14,ci,ci38813983,2019-09-06T07:48:51.378Z,"8km W of Holtville, CA",earthquake,0.5,0.61,0.168,17,automatic,ci,ci\n2019-09-06T07:40:20.680Z,36.0651667,-117.8536667,1.77,0.84,ml,10,151,0.05231,0.1,ci,ci38813975,2019-09-06T07:43:51.125Z,"9km ENE of Coso Junction, CA",earthquake,0.24,0.3,0.064,5,automatic,ci,ci\n2019-09-06T07:39:02.970Z,35.7206667,-117.4936667,1.72,1.08,ml,14,82,0.07948,0.16,ci,ci38813967,2019-09-06T07:42:47.444Z,"10km WSW of Searles Valley, CA",earthquake,0.28,0.47,0.148,13,automatic,ci,ci\n2019-09-06T07:37:49.115Z,60.1577,-141.302,12.6,0.9,ml,,,,0.92,ak,ak019bfx7hhb,2019-09-06T07:43:23.996Z,"63km E of Cape Yakataga, Alaska",earthquake,,0.9,,,automatic,ak,ak\n2019-09-06T07:35:55.170Z,35.6463333,-117.4571667,2.37,1.03,ml,20,58,0.03309,0.16,ci,ci38813959,2019-09-06T07:39:45.342Z,"14km SSW of Searles Valley, CA",earthquake,0.26,0.34,0.15,14,automatic,ci,ci\n2019-09-06T07:34:58.130Z,37.0568352,-121.1033325,2.43,2.08,md,25,81,,0.04,nc,nc73266115,2019-09-06T09:18:03.335Z,"22km W of Los Banos, CA",earthquake,0.19,0.64,0.18,20,automatic,nc,nc\n2019-09-06T07:33:10.100Z,34.0331667,-116.3213333,8.7,0.82,ml,25,59,0.06741,0.19,ci,ci38813951,2019-09-06T14:12:35.930Z,"11km S of Joshua Tree, CA",earthquake,0.34,0.81,0.159,14,reviewed,ci,ci\n2019-09-06T07:32:38.910Z,36.2941667,-89.5035,8.35,1.73,md,22,56,0.03336,0.02,nm,nm60088928,2019-09-06T13:04:19.080Z,"3km NNW of Ridgely, Tennessee",earthquake,0.44,0.58,0.056,14,reviewed,nm,nm\n2019-09-06T07:27:29.780Z,35.609,-117.4395,5.54,1.09,ml,23,74,0.02909,0.18,ci,ci38813943,2019-09-06T07:30:57.046Z,"18km S of Searles Valley, CA",earthquake,0.29,0.54,0.23,16,automatic,ci,ci\n2019-09-06T07:27:21.654Z,61.3824,-147.5344,16.7,2.3,ml,,,,0.67,ak,ak019bfx5a6z,2019-09-06T07:31:41.271Z,"69km WNW of Valdez, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T07:25:36.439Z,28.6893,104.7507,10,4.6,mb,,114,4.427,0.83,us,us70005cng,2019-09-06T08:39:03.040Z,"15km SE of Yibin, China",earthquake,5.1,1.9,0.101,29,reviewed,us,us\n2019-09-06T07:18:08.610Z,18.7981,-68.9433,41,2.16,md,5,199,0.5493,0.23,pr,pr2019249002,2019-09-06T11:46:58.325Z,"10km ENE of Santa Cruz de El Seibo, Dominican Republic",earthquake,9.89,2.37,0.12,5,reviewed,pr,pr\n2019-09-06T07:17:58.330Z,36.2176667,-118.1628333,1.97,1.03,ml,13,107,0.2316,0.16,ci,ci38813935,2019-09-06T07:21:37.979Z,"16km WSW of Olancha, CA",earthquake,0.34,1.89,0.11,13,automatic,ci,ci\n2019-09-06T07:14:31.560Z,35.7715,-117.5795,6.05,0.89,ml,15,133,0.04651,0.19,ci,ci38813927,2019-09-06T07:18:17.783Z,"16km W of Searles Valley, CA",earthquake,0.45,1.04,0.23,11,automatic,ci,ci\n2019-09-06T07:14:02.430Z,35.7038333,-117.5536667,2.37,0.74,ml,17,101,0.08258,0.18,ci,ci38813919,2019-09-06T07:17:46.962Z,"14km NE of Ridgecrest, CA",earthquake,0.38,0.55,0.12,9,automatic,ci,ci\n2019-09-06T07:11:09.040Z,18.1545,-68.3231,81,2.62,md,8,222,1.2375,0.57,pr,pr2019249001,2019-09-06T11:46:24.117Z,"39km SE of Boca de Yuma, Dominican Republic",earthquake,5.44,3.65,0.21,6,reviewed,pr,pr\n2019-09-06T07:08:29.340Z,36.074,-117.872,1.93,1.51,ml,19,126,0.04565,0.11,ci,ci38813911,2019-09-06T07:12:12.920Z,"8km ENE of Coso Junction, CA",earthquake,0.19,0.22,0.286,22,automatic,ci,ci\n2019-09-06T07:06:46.210Z,35.65,-117.4555,2.51,1.84,ml,26,90,0.02998,0.18,ci,ci38813903,2019-09-06T07:17:58.930Z,"14km SSW of Searles Valley, CA",earthquake,0.28,0.37,0.138,25,automatic,ci,ci\n2019-09-06T07:06:21.790Z,35.6488333,-117.4518333,1.73,1.57,ml,27,59,0.0281,0.2,ci,ci38813895,2019-09-06T07:10:18.842Z,"14km SSW of Searles Valley, CA",earthquake,0.28,0.47,0.115,25,automatic,ci,ci\n2019-09-06T07:00:30.401Z,63.564,-147.2336,12.8,1.1,ml,,,,0.81,ak,ak019bfwzijk,2019-09-06T07:03:45.333Z,"87km ENE of Cantwell, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T06:59:30.540Z,35.6288333,-117.4373333,2.35,0.99,ml,21,82,0.03788,0.18,ci,ci38813887,2019-09-06T07:03:06.053Z,"16km S of Searles Valley, CA",earthquake,0.24,0.31,0.183,13,automatic,ci,ci\n2019-09-06T06:50:30.980Z,35.6483333,-117.4541667,2.14,1.84,ml,24,58,0.02995,0.14,ci,ci38813879,2019-09-06T07:03:05.796Z,"14km SSW of Searles Valley, CA",earthquake,0.2,0.3,0.107,21,automatic,ci,ci\n2019-09-06T06:49:34.940Z,35.9193333,-117.6866667,2.06,2.72,ml,34,44,0.04099,0.18,ci,ci38813871,2019-09-06T07:00:49.400Z,"20km E of Little Lake, CA",earthquake,0.21,0.36,0.145,24,automatic,ci,ci\n2019-09-06T06:42:07.410Z,34.9591667,-119.1848333,14.44,0.83,ml,10,96,0.1498,0.16,ci,ci38813855,2019-09-06T15:28:47.284Z,"13km NNW of Pine Mountain Club, CA",earthquake,0.45,0.84,0.045,4,reviewed,ci,ci\n2019-09-06T06:39:18.289Z,36.4475,-98.776,9.06,1.36,ml,33,92,0.02069593875,0.09,ok,ok2019rlpy,2019-09-06T13:39:35.604Z,"33km NW of Fairview, Oklahoma",earthquake,,0.2,0.25,6,reviewed,ok,ok\n2019-09-06T06:37:36.100Z,35.718,-117.5343333,4.24,1.9,ml,33,55,0.09985,0.13,ci,ci38813847,2019-09-06T06:48:44.270Z,"13km WSW of Searles Valley, CA",earthquake,0.2,0.55,0.123,26,automatic,ci,ci\n2019-09-06T06:36:46.410Z,33.5181667,-116.7405,4.07,0.55,ml,29,29,0.04718,0.14,ci,ci38813839,2019-09-06T15:11:42.100Z,"7km WSW of Anza, CA",earthquake,0.16,0.34,0.087,18,reviewed,ci,ci\n2019-09-06T06:33:46.243Z,60.5704,-142.9788,31.8,0.6,ml,,,,0.71,ak,ak019bfwl6sg,2019-09-06T06:35:59.884Z,"63km NNW of Cape Yakataga, Alaska",earthquake,,1.1,,,automatic,ak,ak\n2019-09-06T06:22:42.180Z,35.8816667,-117.6946667,6.54,0.91,ml,16,86,0.07524,0.15,ci,ci38813831,2019-09-06T06:26:19.036Z,"20km ESE of Little Lake, CA",earthquake,0.27,0.77,0.099,13,automatic,ci,ci\n2019-09-06T06:22:11.710Z,19.4064999,-155.2803345,0.11,1.93,md,17,44,0.01166,0.11,hv,hv71128022,2019-09-06T06:25:21.440Z,"5km WSW of Volcano, Hawaii",earthquake,0.15,0.23,0.38,12,automatic,hv,hv\n2019-09-06T06:20:44.732Z,61.0706,-148.4593,0,1.6,ml,,,,0.82,ak,ak019bfwieck,2019-09-06T06:23:47.282Z,"35km NNE of Whittier, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T06:16:41.710Z,35.6521683,-117.4509964,2.48,1.37,ml,20,91,0.06616,0.15,ci,ci38813807,2019-09-06T06:20:19.452Z,"14km SSW of Searles Valley, CA",earthquake,0.38,0.59,0.076,5,automatic,ci,ci\n2019-09-06T06:15:35.276Z,1.0391,30.3133,10,4.6,mb,,74,1.684,0.63,us,us70005cqd,2019-09-06T13:25:01.177Z,"18km W of Ntoroko, Uganda",earthquake,9.3,1.9,0.095,33,reviewed,us,us\n2019-09-06T06:11:12.480Z,35.7795,-117.5941667,6.58,1.44,ml,31,110,0.03626,0.16,ci,ci38813799,2019-09-06T06:14:43.498Z,"17km W of Searles Valley, CA",earthquake,0.22,0.53,0.134,22,automatic,ci,ci\n2019-09-06T06:09:53.990Z,35.6865,-117.5485,1.71,2.05,ml,35,55,0.06647,0.28,ci,ci38813791,2019-09-06T06:13:39.405Z,"14km ENE of Ridgecrest, CA",earthquake,0.34,0.53,0.119,25,automatic,ci,ci\n2019-09-06T06:08:28.710Z,35.7791667,-117.5981667,6.73,1.49,ml,27,109,0.0365,0.15,ci,ci38813783,2019-09-06T06:12:19.397Z,"18km W of Searles Valley, CA",earthquake,0.22,0.52,0.114,23,automatic,ci,ci\n2019-09-06T06:07:48.310Z,35.6938333,-117.4873333,10.49,1,ml,17,118,0.05921,0.18,ci,ci38813775,2019-09-06T06:11:26.389Z,"11km SW of Searles Valley, CA",earthquake,0.44,0.68,0.189,11,automatic,ci,ci\n2019-09-06T06:04:34.180Z,35.8958333,-117.6886667,10.32,0.48,ml,9,82,0.06054,0.04,ci,ci38813767,2019-09-06T06:08:10.362Z,"20km ESE of Little Lake, CA",earthquake,0.2,0.48,0.084,4,automatic,ci,ci\n2019-09-06T06:04:16.420Z,36.276,-89.5,8.62,1.71,md,23,41,0.02185,0.06,nm,nm60088923,2019-09-06T13:20:40.710Z,"1km NW of Ridgely, Tennessee",earthquake,0.22,0.4,0.078,15,reviewed,nm,nm\n2019-09-06T06:01:44.950Z,35.9155,-117.7243333,8.3,0.76,ml,14,56,0.06817,0.07,ci,ci38813759,2019-09-06T06:05:20.425Z,"17km E of Little Lake, CA",earthquake,0.18,0.49,0.206,12,automatic,ci,ci\n2019-09-06T05:56:20.800Z,35.909,-117.7356667,6.04,0.55,ml,9,108,0.07782,0.11,ci,ci38813743,2019-09-06T05:59:47.683Z,"16km E of Little Lake, CA",earthquake,0.27,1.41,0.163,6,automatic,ci,ci\n2019-09-06T05:49:51.140Z,46.8466666666667,-121.7545,0.99,0.8,ml,14,76,,0.09,uw,uw61548481,2019-09-06T16:55:31.900Z,"27km NNW of Packwood, Washington",earthquake,0.28,0.62,0.229150743074078,5,reviewed,uw,uw\n2019-09-06T05:44:39.900Z,33.597,-116.8056667,4.69,0.51,ml,24,72,0.03485,0.14,ci,ci38813735,2019-09-06T14:12:15.673Z,"13km WNW of Anza, CA",earthquake,0.25,0.3,0.142,16,reviewed,ci,ci\n2019-09-06T05:35:20.640Z,35.682,-117.4681667,1.75,0.83,ml,18,144,0.08459,0.22,ci,ci38813727,2019-09-06T05:39:09.707Z,"11km SSW of Searles Valley, CA",earthquake,0.42,0.66,0.184,8,automatic,ci,ci\n2019-09-06T05:30:51.710Z,35.7538333,-117.5765,6.65,0.78,ml,10,139,0.06409,0.13,ci,ci38813719,2019-09-06T05:34:22.331Z,"16km W of Searles Valley, CA",earthquake,0.36,1.02,0.092,10,automatic,ci,ci\n2019-09-06T05:23:25.212Z,61.4812,-148.3068,19,0.7,ml,,,,0.45,ak,ak019bfvxkeh,2019-09-06T05:26:26.527Z,"37km ESE of Lazy Mountain, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T05:22:50.510Z,19.4191666,-155.2833405,-1,1.97,md,14,119,0.001658,0.31,hv,hv71127947,2019-09-06T05:25:55.490Z,"4km WSW of Volcano, Hawaii",earthquake,0.33,0.49,0.17,13,automatic,hv,hv\n2019-09-06T05:13:52.930Z,35.6365,-117.6093333,8.88,2.49,ml,38,33,0.03581,0.15,ci,ci38813703,2019-09-06T14:30:12.811Z,"6km ENE of Ridgecrest, CA",earthquake,0.18,0.58,0.108,25,automatic,ci,ci\n2019-09-06T05:09:59.070Z,35.6798333,-117.4751667,4.88,0.9,ml,21,110,0.04442,0.16,ci,ci38813695,2019-09-06T05:13:44.241Z,"12km SSW of Searles Valley, CA",earthquake,0.33,0.56,0.11,12,automatic,ci,ci\n2019-09-06T05:07:38.940Z,35.9038333,-117.6893333,7.19,0.33,ml,8,96,0.05416,0.26,ci,ci38813679,2019-09-06T05:11:12.447Z,"20km E of Little Lake, CA",earthquake,0.89,1.86,0.149,4,automatic,ci,ci\n2019-09-06T05:00:26.800Z,35.8771667,-117.7168333,3.26,1.23,ml,24,64,0.07881,0.17,ci,ci38813671,2019-09-06T05:04:09.418Z,"18km ESE of Little Lake, CA",earthquake,0.22,0.78,0.176,19,automatic,ci,ci\n2019-09-06T04:57:21.690Z,38.8036652,-122.7894974,2.78,0.55,md,8,138,0.006248,0.02,nc,nc73266075,2019-09-06T05:32:03.509Z,"4km NW of The Geysers, CA",earthquake,0.75,1.72,,1,automatic,nc,nc\n2019-09-06T04:55:21.447Z,61.4866,-149.9594,36.7,2.2,ml,,,,0.69,ak,ak019bfvizcj,2019-09-06T05:05:33.040Z,"3km ESE of Big Lake, Alaska",earthquake,,1.7,,,automatic,ak,ak\n2019-09-06T04:52:01.560Z,35.626,-117.451,1.53,1.07,ml,19,76,0.04046,0.19,ci,ci38813551,2019-09-06T04:55:35.826Z,"16km SSW of Searles Valley, CA",earthquake,0.3,0.48,0.15,14,automatic,ci,ci\n2019-09-06T04:51:26.750Z,38.5581665,-122.2911682,2.54,1.56,md,9,93,0.0335,0.07,nc,nc73266070,2019-09-06T08:02:02.752Z,"14km E of Angwin, CA",earthquake,0.31,1.01,0.19,8,automatic,nc,nc\n2019-09-06T04:49:50.890Z,33.5145,-116.4856667,14.47,0.71,ml,26,92,0.05721,0.14,ci,ci38813543,2019-09-06T14:12:23.361Z,"18km ESE of Anza, CA",earthquake,0.27,0.47,0.117,16,reviewed,ci,ci\n2019-09-06T04:48:30.260Z,38.8053322,-122.7925034,1.38,1.15,md,15,79,0.003422,0.04,nc,nc73266065,2019-09-06T07:36:03.608Z,"4km NW of The Geysers, CA",earthquake,0.31,0.37,0.05,5,automatic,nc,nc\n2019-09-06T04:47:13.320Z,42.6361667,-111.4573333,-0.77,2.13,ml,13,128,0.2931,0.17,uu,uu60339122,2019-09-06T17:25:02.520Z,"12km E of Soda Springs, Idaho",earthquake,0.76,3.03,0.192,3,reviewed,uu,uu\n2019-09-06T04:41:49.820Z,35.677,-117.482,2.66,1.27,ml,21,103,0.04894,0.21,ci,ci38813527,2019-09-06T04:45:31.378Z,"12km SW of Searles Valley, CA",earthquake,0.32,0.45,0.15,16,automatic,ci,ci\n2019-09-06T04:39:39.250Z,47.5661667,-113.907,16.07,-0.25,md,8,141,0.084,0.09,mb,mb80359824,2019-09-06T14:25:07.710Z,"15km ENE of Ronan, Montana",earthquake,0.49,0.9,0.044,4,reviewed,mb,mb\n2019-09-06T04:34:23.060Z,32.8215,-115.4638333,10.97,2.21,ml,25,43,0.02159,0.27,ci,ci38813519,2019-09-06T04:45:03.290Z,"8km W of Holtville, CA",earthquake,0.53,0.83,0.223,27,automatic,ci,ci\n2019-09-06T04:26:05.857Z,16.2069,122.3693,52.44,4.7,mb,,67,7.219,0.64,us,us70005cmh,2019-09-06T04:49:33.040Z,"44km E of Dinalongan, Philippines",earthquake,12.5,9.1,0.085,42,reviewed,us,us\n2019-09-06T04:22:59.990Z,35.897,-117.6946667,7.91,1.17,ml,23,70,0.06223,0.15,ci,ci38813511,2019-09-06T04:33:59.220Z,"20km ESE of Little Lake, CA",earthquake,0.22,0.66,0.239,18,automatic,ci,ci\n2019-09-06T04:11:01.420Z,35.8243333,-117.6606667,6.15,0.78,ml,12,83,0.05204,0.23,ci,ci38813383,2019-09-06T04:14:48.729Z,"23km N of Ridgecrest, CA",earthquake,0.47,1.06,0.09,9,automatic,ci,ci\n2019-09-06T04:10:45.780Z,35.8185,-117.6505,3.96,0.73,ml,9,86,0.04316,0.16,ci,ci38813375,2019-09-06T04:14:17.508Z,"22km N of Ridgecrest, CA",earthquake,0.38,0.8,0.152,9,automatic,ci,ci\n2019-09-06T04:09:09.400Z,35.5875,-97.39533333,7.18,1.51,ml,34,66,0.09088216582,0.09,ok,ok2019rlkz,2019-09-06T13:47:22.723Z,"7km NNW of Spencer, Oklahoma",earthquake,,0.2,0.08,4,reviewed,ok,ok\n`

const earthquakeDatasetEdit = `time,latitude,longitude,depth,mag,mag_type,nst,gap,dmin,rms,net,id,updated,place,type,horizontal_error,depth_error,mag_error,mag_nst,status,location_source,mag_source\n2019-09-06T17:51:31.610Z,35.809166,-117.6346664,5.74,1.2,ml,14,82,0.0309,0.09,ci,ci38814911,2019-09-06T17:53:36.399Z,"21km N of Ridgecrest, CA",earthquake,0.31,0.69,0.195,7,automatic,ci,ci\n2019-09-06T17:49:30.836Z,63.0001,-149.8869,74.1,1.3,ml,,,,0.67,ak,ak019bg38cop,2019-09-06T17:54:23.895Z,"64km SW of Cantwell, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T17:43:23.350Z,33.7381667,-116.568,25.18,0.96,ml,13,139,0.1248,0.38,ci,ci38814887,2019-09-06T17:47:08.725Z,"10km SSW of Palm Springs, CA",earthquake,1.64,3.17,0.349,17,automatic,ci,ci\n2019-09-06T17:33:55.970Z,35.7791667,-117.5498333,12.91,1.11,ml,6,174,0.05324,0.16,ci,ci38814879,2019-09-06T17:37:39.667Z,"13km W of Searles Valley, CA",earthquake,0.78,1.07,0.041,2,automatic,ci,ci\n2019-09-06T17:33:54.480Z,38.7796669,-122.7388306,0.98,0.23,md,5,193,0.003926,0,nc,nc73266360,2019-09-06T17:42:03.427Z,"2km E of The Geysers, CA",earthquake,2.41,0.65,0.15,3,automatic,nc,nc\n2019-09-06T17:33:30.760Z,35.7018333,-117.5416667,2.3,0.99,ml,18,104,0.0827,0.2,ci,ci38814871,2019-09-06T17:37:16.464Z,"14km WSW of Searles Valley, CA",earthquake,0.31,0.45,0.236,13,automatic,ci,ci\n2019-09-06T17:30:36.330Z,35.645,-117.5403333,4.57,0.99,ml,20,72,0.03278,0.17,ci,ci38814863,2019-09-06T17:34:18.108Z,"12km ENE of Ridgecrest, CA",earthquake,0.31,0.52,0.169,12,automatic,ci,ci\n2019-09-06T17:23:02.230Z,35.6256667,-117.4361667,10.33,0.64,ml,15,111,0.04447,0.2,ci,ci38814847,2019-09-06T17:26:39.064Z,"16km S of Searles Valley, CA",earthquake,0.49,0.69,0.077,8,automatic,ci,ci\n2019-09-06T17:06:30.660Z,35.601,-117.604,1.35,0.86,ml,18,54,0.03534,0.17,ci,ci38814815,2019-09-06T17:10:15.959Z,"7km ESE of Ridgecrest, CA",earthquake,0.26,0.42,0.188,13,automatic,ci,ci\n2019-09-06T17:02:10.700Z,35.6896667,-117.5331667,3.64,0.73,ml,18,100,0.07355,0.14,ci,ci38814807,2019-09-06T17:05:57.887Z,"14km SW of Searles Valley, CA",earthquake,0.29,1.11,0.075,10,automatic,ci,ci\n2019-09-06T16:52:16.417Z,65.1411,-148.939,8.3,1.4,ml,,,,0.52,ak,ak019bg2nd7k,2019-09-06T16:56:20.191Z,"54km NW of Ester, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T16:38:28.240Z,39.4796677,-122.946167,0.77,1.99,md,16,60,0.3031,0.13,nc,nc73266340,2019-09-06T17:04:02.637Z,"8km N of Lake Pillsbury, CA",earthquake,0.43,7.78,0.03,4,automatic,nc,nc\n2019-09-06T16:28:51.784Z,60.29,-143.319,10.9,1.4,ml,,,,0.98,ak,ak019bg2igpi,2019-09-06T16:42:56.504Z,"55km WNW of Cape Yakataga, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T16:23:54.810Z,36.187,-117.9935,1.04,1.11,ml,14,134,0.1319,0.18,ci,ci38814711,2019-09-06T16:27:24.703Z,"11km S of Olancha, CA",earthquake,0.48,0.92,0.138,17,automatic,ci,ci\n2019-09-06T16:15:41.280Z,36.106,-117.8491667,4.06,1.28,ml,19,71,0.01244,0.11,ci,ci38814703,2019-09-06T16:19:25.645Z,"11km NE of Coso Junction, CA",earthquake,0.2,0.28,0.264,19,automatic,ci,ci\n2019-09-06T16:15:03.350Z,38.8434982,-122.8301697,2.25,0.57,md,7,164,0.006424,0.01,nc,nc73266335,2019-09-06T16:42:02.396Z,"10km WNW of Cobb, CA",earthquake,1.49,2.79,,1,automatic,nc,nc\n2019-09-06T16:11:19.480Z,35.701,-117.5325,9.15,1.39,ml,26,73,0.08424,0.17,ci,ci38814695,2019-09-06T16:21:47.040Z,"14km WSW of Searles Valley, CA",earthquake,0.3,0.79,0.165,20,automatic,ci,ci\n2019-09-06T16:10:48.203Z,31.3391,-103.0897,5,2.9,mb_lg,,45,0.127,0.69,us,us70005cut,2019-09-06T16:38:21.040Z,"33km SSW of Monahans, Texas",earthquake,0.9,1.6,0.088,34,reviewed,us,us\n2019-09-06T16:09:20.816Z,62.1752,-152.3258,5.7,1.4,ml,,,,0.88,ak,ak019bg2ebp3,2019-09-06T16:13:38.854Z,"116km W of Talkeetna, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T15:57:00.880Z,38.8188324,-122.7646637,2.1,1.14,md,14,61,0.01232,0.03,nc,nc73266330,2019-09-06T16:20:04.218Z,"4km W of Cobb, CA",earthquake,0.27,0.57,0.11,5,automatic,nc,nc\n2019-09-06T15:55:09.944Z,31.3294,-103.0896,5,3.1,mb_lg,,45,0.117,0.71,us,us70005cul,2019-09-06T16:40:10.040Z,"34km SSW of Monahans, Texas",earthquake,1.2,1.7,0.068,57,reviewed,us,us\n2019-09-06T15:51:39.760Z,62.1314,-151.676,107.1,1.7,ml,,,,0.67,ak,ak019bg21xl5,2019-09-06T16:04:46.098Z,"84km WSW of Talkeetna, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T15:51:38.630Z,32.8243333,-115.4688333,11.43,2.34,ml,29,44,0.02653,0.28,ci,ci38814663,2019-09-06T15:55:33.513Z,"8km W of Holtville, CA",earthquake,0.42,0.74,0.222,28,automatic,ci,ci\n2019-09-06T15:46:35.994Z,63.4836,-146.0184,0,1.7,ml,,,,0.81,ak,ak019bg20urk,2019-09-06T16:04:45.732Z,"58km SW of Deltana, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T15:43:52.745Z,61.3871,-152.3036,26.9,0.6,ml,,,,1.01,ak,ak019bg208zt,2019-09-06T16:04:45.348Z,"95km NW of Nikiski, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T15:31:35.172Z,59.6792,-143.9137,27.7,1.9,ml,,,,1.2,ak,ak019bg1xlr0,2019-09-06T15:34:56.849Z,"93km WSW of Cape Yakataga, Alaska",earthquake,,1,,,automatic,ak,ak\n2019-09-06T15:31:32.060Z,32.8193333,-115.4603333,7.68,1.22,ml,13,62,0.01804,0.22,ci,ci38814647,2019-09-06T15:35:19.380Z,"8km W of Holtville, CA",earthquake,0.81,0.87,0.203,9,automatic,ci,ci\n2019-09-06T15:27:56.449Z,-20.1971,169.0722,29.11,5.9,mww,,42,2.841,1.3,us,us70005cu5,2019-09-06T17:39:00.306Z,"74km SSW of Isangel, Vanuatu",earthquake,7.6,3.4,0.058,29,reviewed,us,us\n2019-09-06T15:20:20.079Z,36.25183333,-98.64933333,7.7,1.93,ml,21,199,0.1196765154,0.09,ok,ok2019rmgz,2019-09-06T15:27:59.129Z,"15km W of Fairview, Oklahoma",earthquake,,0.3,0.31,5,reviewed,ok,ok\n2019-09-06T15:16:16.286Z,60.3614,-141.4365,5.6,1.5,ml,,,,1.13,ak,ak019bg1udev,2019-09-06T15:20:13.085Z,"64km ENE of Cape Yakataga, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T15:15:25.255Z,68.9842,-146.9774,0,1.7,ml,,,,1.1,ak,ak019bg1u6q9,2019-09-06T15:20:12.615Z,"112km NNW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T15:10:31.270Z,35.6595,-117.5145,5.64,0.71,ml,17,83,0.0581,0.21,ci,ci38814615,2019-09-06T15:14:15.255Z,"15km ENE of Ridgecrest, CA",earthquake,0.46,31.61,0.056,7,automatic,ci,ci\n2019-09-06T15:03:19.930Z,38.8256683,-122.8006668,3.24,0.83,md,15,66,0.007691,0.02,nc,nc73266300,2019-09-06T15:23:02.807Z,"7km NW of The Geysers, CA",earthquake,0.3,0.71,0.06,2,automatic,nc,nc\n2019-09-06T14:57:47.330Z,35.6971667,-117.4836667,6.37,1.54,ml,27,62,0.09761,0.17,ci,ci38814575,2019-09-06T15:01:35.917Z,"11km SW of Searles Valley, CA",earthquake,0.26,0.92,0.205,25,automatic,ci,ci\n2019-09-06T14:57:01.130Z,35.714,-117.5458333,8.07,1.56,ml,29,51,0.0937,0.19,ci,ci38814567,2019-09-06T15:08:26.770Z,"14km WSW of Searles Valley, CA",earthquake,0.26,0.93,0.111,24,automatic,ci,ci\n2019-09-06T14:51:06.645Z,68.9699,-146.7614,0.9,1.8,ml,,,,0.85,ak,ak019bg1gfkx,2019-09-06T14:55:46.335Z,"106km NNW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T14:48:26.810Z,35.8578333,-117.6781667,7.37,0.31,ml,10,84,0.07784,0.11,ci,ci38814551,2019-09-06T14:52:00.921Z,"22km ESE of Little Lake, CA",earthquake,0.29,1.11,0.095,4,automatic,ci,ci\n2019-09-06T14:46:48.150Z,36.0893333,-117.8488333,2.34,0.89,ml,12,148,0.02861,0.14,ci,ci38814543,2019-09-06T14:50:25.585Z,"10km ENE of Coso Junction, CA",earthquake,0.45,0.26,0.246,11,automatic,ci,ci\n2019-09-06T14:25:28.620Z,45.861,-111.364,4.94,1.59,ml,15,112,0.308,0.22,mb,mb80359834,2019-09-06T14:45:55.280Z,"2km WNW of Manhattan, Montana",earthquake,0.54,4.54,0.058,6,reviewed,mb,mb\n2019-09-06T14:25:27.180Z,37.3521652,-122.0181656,21.42,1.24,md,5,142,,0.06,nc,nc73266280,2019-09-06T16:32:03.333Z,"2km SSE of Sunnyvale, CA",earthquake,1.27,1.75,0.19,4,automatic,nc,nc\n2019-09-06T14:06:15.510Z,35.6761667,-117.5148333,10.05,2.75,ml,40,38,0.06979,0.15,ci,ci38814519,2019-09-06T14:17:15.390Z,"14km SW of Searles Valley, CA",earthquake,0.21,0.41,0.199,26,automatic,ci,ci\n2019-09-06T14:01:37.926Z,68.8306,-146.269,2.6,1.8,ml,,,,0.4,ak,ak019bg15s2o,2019-09-06T14:07:04.196Z,"84km NNW of Arctic Village, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T13:56:10.551Z,68.7081,-147.0643,0,2.3,ml,,,,0.81,ak,ak019bg0w2qn,2019-09-06T14:02:42.406Z,"90km NW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T13:55:01.850Z,38.7811661,-122.7440033,0.4,0.16,md,7,111,0.006053,0.05,nc,nc73266265,2019-09-06T15:49:02.957Z,"1km ENE of The Geysers, CA",earthquake,0.42,1.72,0.08,2,automatic,nc,nc\n2019-09-06T13:54:01.960Z,19.4501667,-155.2949982,0.13,1.97,ml,11,277,0.02927,0.24,hv,hv71128362,2019-09-06T13:59:50.720Z,"6km WNW of Volcano, Hawaii",earthquake,0.76,0.55,0.45,4,automatic,hv,hv\n2019-09-06T13:50:35.389Z,60.212,-152.4047,98.7,1.4,ml,,,,0.61,ak,ak019bg0uubz,2019-09-06T13:59:20.714Z,"35km SSE of Redoubt Volcano, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T13:45:16.290Z,35.7743333,-117.6006667,14.63,1.01,ml,17,108,0.0414,0.23,ci,ci38814511,2019-09-06T13:48:56.237Z,"18km W of Searles Valley, CA",earthquake,0.73,1.16,0.206,11,automatic,ci,ci\n2019-09-06T13:32:25.220Z,35.8508333,-117.6745,7.81,1.36,ml,21,83,0.07169,0.2,ci,ci38814495,2019-09-06T13:36:06.163Z,"23km ESE of Little Lake, CA",earthquake,0.35,0.95,0.205,18,automatic,ci,ci\n2019-09-06T13:31:24.410Z,35.6765,-117.5495,7.21,0.8,ml,13,111,0.05664,0.18,ci,ci38814487,2019-09-06T13:35:02.189Z,"13km ENE of Ridgecrest, CA",earthquake,0.41,0.82,0.108,11,automatic,ci,ci\n2019-09-06T13:19:36.789Z,36.47983333,-98.73133333,8.71,0.48,ml,13,123,0.008998234239,0.05,ok,ok2019rmdd,2019-09-06T14:10:04.919Z,"32km NW of Fairview, Oklahoma",earthquake,,0.3,0.16,4,reviewed,ok,ok\n2019-09-06T13:19:17.425Z,63.4992,-149.5741,104,2.4,ml,,,,0.7,ak,ak019bg0o5q5,2019-09-06T13:29:43.041Z,"33km WNW of Cantwell, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T13:04:58.333Z,65.1099,-148.8274,12.6,1.1,ml,,,,0.84,ak,ak019bg0l170,2019-09-06T13:09:36.330Z,"48km NW of Ester, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T12:58:11.634Z,63.2055,-151.1012,0,1.4,ml,,,,0.62,ak,ak019bg0b2nf,2019-09-06T13:01:43.647Z,"109km W of Cantwell, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T12:56:23.680Z,46.8686667,-112.5231667,11.53,1.02,ml,9,101,0.179,0.09,mb,mb80359819,2019-09-06T14:19:30.350Z,"15km SE of Lincoln, Montana",earthquake,0.49,1.21,0.132,2,reviewed,mb,mb\n2019-09-06T12:56:05.520Z,36.779335,-120.8694992,3.08,2.22,md,24,153,0.1313,0.1,nc,nc73266250,2019-09-06T15:22:02.800Z,"28km SW of South Dos Palos, CA",earthquake,0.46,1.1,0.12,15,automatic,nc,nc\n2019-09-06T12:54:33.400Z,35.5281667,-117.3955,6.22,1.09,ml,19,66,0.02546,0.18,ci,ci38814455,2019-09-06T12:58:21.918Z,"26km S of Trona, CA",earthquake,0.38,0.71,0.145,17,automatic,ci,ci\n2019-09-06T12:52:47.301Z,58.7858,-154.9127,145.2,2.4,ml,,,,0.6,ak,ak019bg09v3u,2019-09-06T12:59:02.659Z,"101km E of King Salmon, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T12:44:32.210Z,35.6565,-117.4515,4.7,1.16,ml,21,59,0.02423,0.16,ci,ci38814447,2019-09-06T12:48:16.856Z,"13km SSW of Searles Valley, CA",earthquake,0.29,0.48,0.177,16,automatic,ci,ci\n2019-09-06T12:43:46.247Z,61.3552,-150.0878,36.5,2,ml,,,,0.75,ak,ak019bg07xii,2019-09-06T12:55:41.096Z,"18km NNW of Anchorage, Alaska",earthquake,,0.9,,,automatic,ak,ak\n2019-09-06T12:41:28.123Z,61.8922,-149.6081,4.9,0.9,ml,,,,0.51,ak,ak019bg07gr0,2019-09-06T12:45:16.797Z,"25km NW of Fishhook, Alaska",earthquake,,0.9,,,automatic,ak,ak\n2019-09-06T12:38:12.780Z,35.7833333,-117.6536667,8.26,1.46,ml,25,52,0.05594,0.17,ci,ci38814439,2019-09-06T12:41:59.120Z,"18km N of Ridgecrest, CA",earthquake,0.22,0.68,0.185,21,automatic,ci,ci\n2019-09-06T12:33:31.200Z,35.8553352,-117.685997,6.85,1.04,ml,15,78,0.07929,0.05,ci,ci38814423,2019-09-06T12:37:00.790Z,"22km ESE of Little Lake, CA",earthquake,0.32,1.04,0.142,5,automatic,ci,ci\n2019-09-06T12:30:30.930Z,35.8116667,-117.6378333,4.43,0.42,ml,8,71,0.03303,0.12,ci,ci38814407,2019-09-06T12:34:12.772Z,"22km N of Ridgecrest, CA",earthquake,0.32,0.55,0.131,5,automatic,ci,ci\n2019-09-06T12:20:45.490Z,38.8343315,-122.7891693,1.67,0.41,md,7,99,0.004174,0.01,nc,nc73266240,2019-09-06T12:42:03.652Z,"6km WNW of Cobb, CA",earthquake,0.62,0.5,0.16,2,automatic,nc,nc\n2019-09-06T12:20:14.508Z,63.2194,-151.0169,3.8,1.8,ml,,,,0.73,ak,ak019bg02xnw,2019-09-06T12:24:32.087Z,"105km W of Cantwell, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T12:19:43.340Z,35.9011667,-117.7011667,9.24,1.16,ml,21,85,0.06224,0.1,ci,ci38814399,2019-09-06T12:23:19.602Z,"19km ESE of Little Lake, CA",earthquake,0.21,0.49,0.203,16,automatic,ci,ci\n2019-09-06T12:08:51.440Z,38.7784996,-122.7220001,1.33,0.46,md,6,102,0.01244,0.02,nc,nc73266235,2019-09-06T12:31:02.593Z,"3km W of Anderson Springs, CA",earthquake,0.84,2.15,0.3,2,automatic,nc,nc\n2019-09-06T12:03:57.929Z,60.0194,-152.6083,97.6,1.8,ml,,,,0.69,ak,ak019bfzzdt6,2019-09-06T12:10:19.002Z,"51km WNW of Anchor Point, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T12:02:24.643Z,3.8946,126.4531,73.62,4.8,mb,,105,3.233,0.81,us,us70005cr0,2019-09-06T12:41:09.040Z,"199km SSE of Sarangani, Philippines",earthquake,5.7,8.6,0.079,49,reviewed,us,us\n2019-09-06T12:01:29.290Z,37.6263351,-118.8586655,7.75,1.02,md,8,129,0.008082,0.04,nc,nc73266230,2019-09-06T14:40:03.398Z,"11km E of Mammoth Lakes, CA",earthquake,2.25,2.27,0.14,9,automatic,nc,nc\n2019-09-06T11:54:16.860Z,35.8566667,-117.6933333,5.5,1.42,ml,29,47,0.0754,0.16,ci,ci38814375,2019-09-06T12:04:43.000Z,"21km ESE of Little Lake, CA",earthquake,0.2,0.77,0.185,24,automatic,ci,ci\n2019-09-06T11:50:25.980Z,32.8103333,-115.4551667,12.34,1.66,ml,22,48,0.008646,0.25,ci,ci37426741,2019-09-06T16:10:41.589Z,"7km W of Holtville, CA",earthquake,0.39,0.64,0.231,27,reviewed,ci,ci\n2019-09-06T11:50:22.590Z,32.8071667,-115.4506667,9.47,1.02,ml,13,117,0.003748,0.22,ci,ci38814367,2019-09-06T15:42:03.420Z,"7km W of Holtville, CA",earthquake,0.77,1.15,0.068,3,reviewed,ci,ci\n2019-09-06T11:49:23.800Z,35.6121667,-117.4676667,9.31,0.97,ml,18,64,0.02392,0.19,ci,ci38814359,2019-09-06T11:52:54.517Z,"18km SSW of Searles Valley, CA",earthquake,0.4,0.61,0.264,7,automatic,ci,ci\n2019-09-06T11:45:59.430Z,36.9196663,-121.6399994,6.37,1.48,md,13,107,0.02081,0.08,nc,nc73266225,2019-09-06T14:14:04.253Z,"4km N of Aromas, CA",earthquake,0.47,0.61,0.11,10,automatic,nc,nc\n2019-09-06T11:45:43.030Z,35.7383333,-117.6028333,13.92,0.64,ml,12,126,0.07736,0.32,ci,ci38814351,2019-09-06T11:49:19.378Z,"15km NNE of Ridgecrest, CA",earthquake,0.95,1.6,0.279,9,automatic,ci,ci\n2019-09-06T11:45:09.740Z,35.8308333,-117.658,3,0.44,ml,8,81,0.05141,0.11,ci,ci38814343,2019-09-06T11:48:43.493Z,"23km N of Ridgecrest, CA",earthquake,0.26,0.34,0.16,7,automatic,ci,ci\n2019-09-06T11:42:51.150Z,35.7828331,-117.6261673,11.04,0.76,ml,9,194,0.04026,0.04,ci,ci38814327,2019-09-06T11:46:18.480Z,"19km NNE of Ridgecrest, CA",earthquake,0.83,1.78,0.228,7,automatic,ci,ci\n2019-09-06T11:42:00.960Z,35.6963333,-117.4933333,4.99,0.96,ml,16,138,0.0647,0.17,ci,ci38814319,2019-09-06T11:45:33.473Z,"11km SW of Searles Valley, CA",earthquake,0.4,0.67,0.171,11,automatic,ci,ci\n2019-09-06T11:39:22.790Z,35.7996667,-117.6355,5.82,0.91,ml,23,64,0.0348,0.18,ci,ci38814311,2019-09-06T11:43:12.489Z,"20km N of Ridgecrest, CA",earthquake,0.28,0.73,0.169,11,automatic,ci,ci\n2019-09-06T11:29:34.490Z,35.8203333,-117.6048333,2.5,0.94,ml,10,107,0.007512,0.19,ci,ci38814295,2019-09-06T11:33:08.487Z,"19km WNW of Searles Valley, CA",earthquake,0.71,0.39,0.13,12,automatic,ci,ci\n`
