import path from 'path'
import os from 'os'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import TestTempRegistry from '../utils/testTempRegistry'
import fakeDialog from 'spectron-fake-dialog'
import { E2ETestUtils, newE2ETestUtils } from '../utils/e2eTestUtils'
import http from 'http'
import Dataset, { Commit, Meta, Schema, Structure } from '../../app/models/dataset'
import { schemaColumns } from '../../app/utils/schemaColumns'

const { Application } = require('spectron')

const takeScreenshots = false
const printConsoleLogs = false

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
  const datasetName = 'all_week'
  const datasetRename = 'earthquakes'

  const jsonFilename = 'test_dataset.json'
  const jsonDatasetName = 'test_dataset'

  const username = 'fred'
  const email = 'fred@qri.io'
  const password = '1234567890!!'

  const createdCommitTitle = 'created dataset'

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
    keywords: ['earthquakes', 'USGS'],
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
    },
    entries: 3,
    length: 100,
    errCount: 0
  }

  const structureCommit: Commit = {
    title: 'edited Structure',
    message: 'edited format config and some schema fields',
    timestamp: metaCommit.timestamp
  }

  const registryDatasetName = 'synths'
  const registryLoc = 'http://localhost:2500'
  const registryNewCommitAction = '/sim/action?action=appendsynthsdataset'

  const healthCheck = async () => {
    return new Promise((res, rej) => {
      http.get('http://localhost:2503/health', (data: http.IncomingMessage) => {
        res(true)
      }).on('error', (e) => {
        res(false)
      })
    })
  }

  beforeAll(async () => {
    jest.setTimeout(60000)

    var isQriRunning = await healthCheck()

    if (isQriRunning) {
      throw new Error("An instance of Qri is already running. Aborting e2e tests.")
    }

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
    if (printConsoleLogs && app) {
      app.client.getMainProcessLogs().then((logs: any[]) => {
        logs.forEach((log) => {
          console.log(log)
        })
      })
      app.client.getRenderProcessLogs().then((logs: any[]) => {
        logs.forEach((log) => {
          console.log(log)
        })
      })
    }
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

  it('accept terms of service', async () => {
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

  it('create a new account', async () => {
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

  it('create a new JSON dataset from a data source', async () => {
    const {
      atLocation,
      atDataset,
      click,
      atDatasetVersion,
      checkStatus,
      takeScreenshot
    } = utils

    // make sure we are on the collection page
    await click('#collection')
    await atLocation('#/collection')

    // click new-dataset to open up the Create Dataset modal
    await click('#new-dataset')

    // mock the dialog and create a temp csv file
    // clicking the '#chooseBodyFile' button will connect the fakeDialog
    // to the correct input
    const jsonPath = path.join(backend.dir, jsonFilename)
    fs.writeFileSync(jsonPath, '{"a": 1, "b":2, "c": 3}')
    await app.client.chooseFile(`#chooseBodyFile-input`, jsonPath)
    if (takeScreenshots) {
      takeScreenshot(artifactPath('json_dataset-choose_body_file.png'))
    }
    // submit to create a new dataset
    await click('#submit')

    if (takeScreenshots) {
      takeScreenshot(artifactPath('json_dataset-submit'))
    }

    // ensure we have redirected to the dataset section
    await atDataset(username, jsonDatasetName)
    if (takeScreenshots) {
      takeScreenshot(artifactPath('json_dataset-at_location_dataset.png'))
    }

    // enure we are on the latest commit
    await atDatasetVersion(0)

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('structure', 'added')

    await click('#collection')
  })

  it('create new CSV dataset from a data source', async () => {
    const {
      atLocation,
      atDataset,
      click,
      atDatasetVersion,
      checkStatus,
      delay,
      waitForExist,
      takeScreenshot
    } = utils

    await click("#collection")
    // make sure we are on the collection page
    await atLocation('#/collection')

    // click new-dataset to open up the Create Dataset modal
    await click('#new-dataset')

    // mock the dialog and create a temp csv file
    const csvPath = path.join(backend.dir, filename)
    fs.writeFileSync(csvPath, earthquakeDataset)
    await waitForExist('#chooseBodyFile-input')
    await app.client.chooseFile(`#chooseBodyFile-input`, csvPath)
    await delay(100)

    // submit to create a new dataset
    await click('#submit')

    // ensure we are redirected to the dataset
    await atDataset(username, datasetName)

    // ensure a initial version was made
    await atDatasetVersion(0)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-dataset-history.png'))
    }

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('structure', 'added')
  })

  it('navigate to collection and back to dataset', async () => {
    const {
      atLocation,
      atDataset,
      click,
      atDatasetVersion
    } = utils

    await click('#collection')
    // ensure we have redirected to the collection page
    await atLocation('#/collection')
    // click the dataset
    const ref = `#row-${username}-${datasetName}`
    await click(ref)
    // ensure we have redirected to the dataset page
    await atDataset(username, datasetName)
    // ensure we are at the right version
    await atDatasetVersion(0)
  })

  // checkout
  it('checkout a dataset', async () => {
    const {
      atDataset,
      click,
      waitForNotExist,
      takeScreenshot
    } = utils

    // ensure we at at the correct page
    await atDataset(username, datasetName)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('dataset-checkout.png'))
    }

    // click #checkout to open checkout modal
    await click('#checkout')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('checkout-modal.png'))
    }

    // mock the dialog
    await fakeDialog.mock([ { method: 'showOpenDialogSync', value: [backend.dir] } ])
    // click #chooseCheckoutLocation to open dialog
    await click('#chooseCheckoutLocation')
    // click #submit
    await click('#submit')
    // expect modal to be gone
    await waitForNotExist('#checkout-dataset')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-dataset-status.png'))
    }
  })

  // body write & commit
  it('write the body to the filesystem & commit', async () => {
    const {
      click,
      doesNotExist,
      checkStatus
    } = utils

    // on status tab
    await click('#working-version', artifactPath('write-the-body-to-the-filesystem-and-commit-click-working-version.png'))
    // no changes, so cannot commit
    await doesNotExist('.clear-to-commit #commit-status', artifactPath('write-the-body-to-the-filesystem-and-commit-does-not-exist-clear-to-commit.png'))
    // create file in memory and save over the previous body.csv
    const csvPath = path.join(backend.dir, datasetName, 'body.csv')
    fs.writeFileSync(csvPath, earthquakeDatasetEdit)

    await checkStatus("body", "modified")

    await writeCommitAndSubmit("write-fsi-body", "body", "modified", bodyCommitTitle, bodyCommitMessage, utils, imagesDir)
  })

  // meta write and commit
  it('fsi editing - create a meta & commit', async () => {
    await utils.atDataset(username, datasetName)
    await editMetaAndCommit('fsi-meta-edit', { meta, commit: metaCommit }, 'added', utils, imagesDir)
  })

  // structure write and commit
  it('fsi editing - edit the structure & commit', async () => {
    await utils.atDataset(username, datasetName)
    await editCSVStructureAndCommit('fsi-setructure-edit', { structure: csvStructure, commit: structureCommit }, 'modified', utils, imagesDir)
  })

  // rename
  it('rename a dataset', async () => {
    const {
      click,
      waitForExist,
      waitForNotExist,
      atDataset,
      setValue,
      doesNotExist,
      sendKeys,
      takeScreenshot,
      isEnabled
    } = utils

    await atDataset(username, datasetName)

    // open navbar hamburger
    await click('#navbar-hamburger')
    // open rename modal
    await click('#rename')
    // make sure modal exists
    await waitForExist('#rename-dataset')
    // the input exists
    await waitForExist('#dataset-name-input')
    // setValue as a bad name
    await setValue('#dataset-name-input', '9test')
    // class should be error
    await waitForExist('#dataset-name-input.invalid')
    // setValue as good name
    await setValue('#dataset-name-input', datasetRename)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-datase-rename.png'))
    }

    // get correct class
    await doesNotExist('#dataset-name-input.invalid')
    await sendKeys('#dataset-name-input', "Enter")
    expect(await isEnabled('#submit')).toBe(true)

    await click('#submit')
    await waitForNotExist('#rename-dataset')
  })

  it('export CSV version', async () => {
    const { click, delay } = utils

    const savePath = path.join(backend.dir, 'body.csv')
    await fakeDialog.mock([ { method: 'showSaveDialogSync', value: savePath } ])

    await click('#export-button')
    await click('#submit')
    await delay(500) // wait to ensure file has time to write
    expect(fs.existsSync(savePath)).toEqual(true)
  })

  // switch between commits
  it('switch between commits', async () => {
    const {
      click,
      atDataset,
      expectTextToContain,
      waitForExist,
      takeScreenshot
    } = utils

    // ensure we have redirected to the dataset page
    await atDataset(username, datasetRename)

    takeScreenshot(artifactPath('fsi-checking-commits.png'))

    // click the original commit and check commit title
    await click('#HEAD-3', artifactPath('switch-between-commits-click-head-3.png'))
    await click('#commit-status')
    await waitForExist("#history-commit")

    await expectTextToContain('#history-commit', createdCommitTitle, artifactPath('fsi-editing-commit-title-created-dataset.png'))

    // click the third commit and check commit title
    await click('#HEAD-2')
    await click('#commit-status')
    await waitForExist("#history-commit")
    await expectTextToContain('#history-commit', bodyCommitTitle, artifactPath('fsi-editing-commit-title-body-commit.png'))

    // click the second commit and check commit title
    await click('#HEAD-1')
    await click('#commit-status')
    await waitForExist("#history-commit")
    await expectTextToContain('#history-commit', metaCommit.title, artifactPath('fsi-editing-commit-title-meta-commit.png'))

    // click the most recent commit and check commit title
    await click('#HEAD-0')
    await click('#commit-status')
    await waitForExist("#history-commit")
    await expectTextToContain('#history-commit', structureCommit.title, artifactPath('fsi-editing-commit-title-structure-commit.png'))
  })

  it('create another CSV dataset from a data source', async () => {
    const {
      atLocation,
      atDataset,
      click,
      checkStatus,
      atDatasetVersion,
      delay,
      takeScreenshot,
      waitForExist
    } = utils

    await click('#collection')
    // make sure we are on the collection page
    await atLocation('#/collection')

    // click new-dataset to open up the Create Dataset modal
    await click('#new-dataset')

    // mock the dialog and create a temp csv file
    const csvPath = path.join(backend.dir, filename)
    fs.writeFileSync(csvPath, earthquakeDataset)
    await waitForExist('#chooseBodyFile-input')
    await app.client.chooseFile(`#chooseBodyFile-input`, csvPath)
    await delay(100)

    // submit to create a new dataset
    await click('#submit')

    // ensure we are redirected to the dataset
    await atDataset(username, datasetName)

    // ensure we are on the latest commit
    await atDatasetVersion(0)

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('csv-dataset-history.png'))
    }

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('meta', 'added')
    await checkStatus('structure', 'added')
  })

  // meta write and commit
  it('in app editing - create a meta & commit', async () => {
    await utils.atDataset(username, datasetName)
    await editMetaAndCommit('in-app-meta-edit', { meta, commit: metaCommit }, 'added', utils, imagesDir)
  })

  // structure write and commit
  it('in app editing - edit the structure & commit', async () => {
    await utils.atDataset(username, datasetName)
    await editCSVStructureAndCommit('in-app-structure-edit', { structure: csvStructure, commit: structureCommit }, 'modified', utils, imagesDir)
  })

  // switch between commits
  it('in app editing - switch between commits', async () => {
    const {
      delay,
      click,
      atDataset,
      waitForExist,
      expectTextToContain,
      takeScreenshot
    } = utils

    // make sure we are on the dataset page, looking at history
    await atDataset(username, datasetName)

    // to reduce loading time, click on the meta component
    // otherwise, we would be loading the body on each click
    await click('#commit-status')
    await delay(500)
    takeScreenshot(artifactPath('in-app-checking-commits.png'))

    // click the third commit and check commit title
    await click('#HEAD-2', artifactPath('in-app-editing-switch-between-commits-click-head-3.png'))
    await click('#commit-status')
    await waitForExist("#history-commit")
    await expectTextToContain('#history-commit', createdCommitTitle, artifactPath('in-app-editing-commit-title-created-dataset.png'))

    // click the third commit and check commit title
    await click('#HEAD-1')
    await click('#commit-status')
    await waitForExist("#history-commit")
    await expectTextToContain('#history-commit', metaCommit.title, artifactPath('in-app-editing-commit-title-meta-commit.png'))

    // click the third commit and check commit title
    await click('#HEAD-0')
    await click('#commit-status')
    await waitForExist("#history-commit")
    await expectTextToContain('#history-commit', structureCommit.title, artifactPath('in-app-editing-commit-title-structure-commit.png'))
  })

  it('Search: search for a foreign dataset, navigate it, clone it', async () => {
    const {
      atLocation,
      atDataset,
      click,
      expectTextToContain,
      waitForExist,
      atDatasetVersion,
      sendKeys,
      setValue,
      takeScreenshot
    } = utils
    // make sure we are on the network page
    await click('#network')
    await atLocation('#/network', artifactPath('search_for_foreign_dataset-at-location-network.png'))

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
    await atLocation('#/network')

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('network-preview.png'))
    }

    // clone the dataset by clicking on the action button
    await click('#sidebar-action')
    await atLocation('#/collection')
    await atDataset('', registryDatasetName)

    await atDatasetVersion(0)

    // the dataset should be part of the collection
    await click('#collection')
    await atLocation('#/collection')

    // check that we have the expected number of datasets
    await expectTextToContain('#all-datasets-button', "4")

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
      waitForExist,
      expectTextToContain,
      waitForNotExist
    } = utils

    // click the Network tab
    await click('#network')
    await atLocation('#/network', artifactPath('network_tab_at_feed-at_location_network.png'))

    // there should only be one dataset item in the list
    const recentDatasets = await app.client.$$('.recent-datasets-item')
    expect(recentDatasets.length).toBe(1)

    // ensure we are inspecting the correct dataset & navigate to the preview page
    await expectTextToContain('#recent-0 .header a', registryDatasetName)
    await click('#recent-0 .header a')

    await waitForExist('.history-list-item')
    // there should be two history items
    const historyItems = await app.client.$$('.history-list-item')
    expect(historyItems.length).toBe(2)

    // since this dataset has already been cloned, expect NO sidebar action button
    await waitForNotExist('#sidebar-action')
  })

  it('publishing a dataset adds a dataset to the network feed, unpublishing removes it', async () => {
    const {
      click,
      atLocation,
      atDataset,
      waitForExist,
      takeScreenshot
    } = utils

    await click('#collection')
    await atLocation('#/collection')
    await click(`#row-${username}-${datasetRename}`)

    // check location
    await atDataset(username, datasetRename)

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

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('network-preview-with-local.png'))
    }

    // head back to the dataset & unpublish
    await click('#collection', artifactPath('network-click-collection.png'))
    await atLocation('#/collection')
    await click(`#row-${username}-${datasetRename}`)
    await atDataset(username, datasetRename, artifactPath('network-at-location-navigate-to-dataset.png'))

    // click the hamburger & click the unpublish action
    await click('#navbar-hamburger', artifactPath('network-click-hamburger.png'))

    if (takeScreenshots) {
      await takeScreenshot(artifactPath('unpublish-hamburger.png'))
    }

    await click('#unpublish-button', artifactPath('network-click-unpublish-action.png'))
    await click('#submit', artifactPath('network-click-submit.png'))

    // publish button should exist again
    await waitForExist('#publish-button', artifactPath('network-after-unpublish-publish-button-should-exit.png'))

    // naviate to feed
    await click('#network')
    await atLocation('#/network')

    // should be two recent datasets, dataset username/datasetName should exist
    recentDatasets = await app.client.$$('.recent-datasets-item')
    expect(recentDatasets.length).toBe(1)
  })

  it('remove a dataset from the dataset page', async () => {
    const {
      click,
      atDataset,
      atLocation,
      waitForExist,
      waitForNotExist,
      doesNotExist
    } = utils

    // on dataset
    await click('#collection')
    // click on dataset
    await click(`#row-${username}-${datasetName}`)
    await atDataset(username, datasetName)

    // open navbar hamburger
    await click('#navbar-hamburger')
    // click remove
    await click('#remove-button')
    // wait for modal to load
    await waitForExist('#remove-dataset')
    // remove the dataset
    await click('#submit')
    // wait for modal to go away
    await waitForNotExist('#remove-dataset')

    // end up on collection page
    await atLocation('#/collection')
    // no datasets
    await doesNotExist(`#row-${username}-${datasetName}`)
  })

  it('removes multiple datasets from Collections page via bulk remove action', async () => {
    const {
      atLocation,
      click,
      createDatasetForUser,
      expectTextToBe,
      delay,
      waitForExist
    } = utils

    const jsonFilename0 = 'dataset_to_be_removed_0.json'
    const jsonDatasetName0 = 'dataset_to_be_removed_0'
    const jsonFilename1 = 'dataset_to_be_removed_1.json'
    const jsonDatasetName1 = 'dataset_to_be_removed_1'

    await delay(1000)
    await createDatasetForUser(jsonFilename0, jsonDatasetName0, username, backend)
    await createDatasetForUser(jsonFilename1, jsonDatasetName1, username, backend)

    // make sure we are on the collection page
    await click('#collection')
    await atLocation('#/collection')

    // select both newly created datasets and click the remove button
    await click(`input[name='select-row-${username}-${jsonDatasetName0}']`)
    await click(`input[name='select-row-${username}-${jsonDatasetName1}']`)
    await click("#button-bulk-remove")

    // expect bulk remove modal to appear
    await waitForExist("#remove-dataset")

    // click remove button
    await click("#submit")

    // ensure both datasets are removed from collection page
    await expectTextToBe(".active .count-indicator", "3")
  })

  it('removes a single dataset from Collections page via bulk remove action', async () => {
    const {
      atLocation,
      click,
      createDatasetForUser,
      expectTextToBe,
      delay,
      waitForExist
    } = utils

    const jsonFilename = 'dataset_to_be_removed.json'
    const jsonDatasetName = 'dataset_to_be_removed'

    await delay(1000)
    await createDatasetForUser(jsonFilename, jsonDatasetName, username, backend)

    // make sure we are on the collection page
    await click('#collection')
    await atLocation('#/collection')

    // select newly created dataset and click the remove button
    await click(`input[name='select-row-${username}-${jsonDatasetName}']`)
    await click("#button-bulk-remove")

    // expect bulk remove modal to appear
    await waitForExist("#remove-dataset")

    // click remove button
    await click("#submit")

    // ensure both datasets are removed from collection page
    await expectTextToBe(".active .count-indicator", "3")
  })
})

async function writeCommitAndSubmit (uniqueName: string, component: string, status: 'added' | 'modified' | 'removed', commitTitle: string, commitMessage: string | undefined, utils: E2ETestUtils, imagesDir: string) {
  // remove any illegal characters
  const name = uniqueName.replace(/([^a-z0-9]+)/gi, '-')

  const {
    click,
    atLocation,
    waitForExist,
    delay,
    setValue,
    takeScreenshot,
    checkStatus,
    atDatasetVersion,
    expectTextToContain
  } = utils

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
  await delay(200)
  await atLocation('/collection/changereport')

  // click on the "right" to get back to the
  await click('#right')
  await delay(200)

  await atDatasetVersion(0, artifactPathFromDir(imagesDir, `${name}-commit-on-history-tab.png`))
  // check component status
  await checkStatus(component, status, artifactPathFromDir(imagesDir, `${name}-commit-check-status-${component}-${status}.png`))
  // commit title should be the same
  await click('#commit-status')
  await expectTextToContain('#history-commit', commitTitle, artifactPathFromDir(imagesDir, `${name}-commit-expect-text-to-be-commit-title.png`))

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-commit-history.png`))
  }
}

async function editMetaAndCommit (uniqueName: string, dataset: Dataset, status: 'added' | 'modified' | 'removed', utils: E2ETestUtils, imagesDir: string) {
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

  if (!meta || !commit || !commit.title) throw new Error('expected meta and commit to exist when dataset is passed to `editMetaAndCommit` function')

  // on status tab
  await click('#working-version', artifactPathFromDir(imagesDir, `${name}-click-working-version.png`))
  // commit should be disabled
  await doesNotExist('.clear-to-commit #commit-status', artifactPathFromDir(imagesDir, `${name}-commit-does-not-exist-clear-to-commit.png`))
  // click #meta-status
  await click('#meta-status', artifactPathFromDir(imagesDir, `${name}-click-meta-status.png`))
  // set value for title and description
  if (meta.title) {
    await setValue('#title', meta.title, artifactPathFromDir(imagesDir, `${name}-set-value-title.png`))
    await delay(100)
  }
  if (meta.description) {
    await setValue('#description', meta.description, artifactPathFromDir(imagesDir, `${name}-set-value-description.png`))
    await delay(100)
  }

  // add 1 theme, add a 2nd theme, remove the first theme
  if (meta.theme && meta.theme.length > 0) {
    await setValue('#theme-tag-input', 'test')
    await delay(100)
    await sendKeys('#theme-tag-input', "Enter")
    await delay(100)
    await waitForExist('#theme-tag-0')
    await expectTextToBe('#theme-tag-0', 'test')
    await delay(100)

    await setValue('#theme-tag-input', meta.theme[0])
    await sendKeys('#theme-tag-input', "Enter")
    await delay(100)

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
      await delay(100)
      await waitForExist('#keywords-tag-0')
      await expectTextToBe('#keywords-tag-0', meta.keywords[0])
    }
    if (meta.keywords.length > 1) {
      await setValue('#keywords-tag-input', meta.keywords[1])
      await sendKeys('#keywords-tag-input', "Tab")
      await delay(100)
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
    await delay(100)
    await setValue('#contributors-row-0 #name-0', meta.contributors[0].name)
    await sendKeys('#contributors-row-0 #name-0', "Tab")
    await delay(100)
    await setValue('#contributors-row-0 #email-0', meta.contributors[0].email)
    await sendKeys('#contributors-row-0 #email-0', "Tab")
    await delay(100)
  }

  // set citations row 1
  if (meta.citations && meta.citations.length > 0) {
    await click('#citations-add-item')
    await waitForExist('#citations-row-0')
    await setValue('#citations-row-0 #name-0', 'name - will be removed')
    await sendKeys('#citations-row-0 #name-0', "Tab")
    await delay(100)
    await setValue('#citations-row-0 #url-0', 'url - will be removed')
    await sendKeys('#citations-row-0 #url-0', "Tab")
    await delay(100)
    await setValue('#citations-row-0 #email-0', 'email - will be removed')
    await sendKeys('#citations-row-0 #email-0', "Tab")
    await delay(100)

    // set citations row 2
    await click('#citations-add-item')
    await waitForExist('#citations-row-1')
    await setValue('#citations-row-1 #name-1', meta.citations[0].name)
    await sendKeys('#citations-row-1 #name-1', "Tab")
    await delay(100)
    await setValue('#citations-row-1 #url-1', meta.citations[0].url)
    await sendKeys('#citations-row-1 #url-1', "Tab")
    await delay(100)
    await setValue('#citations-row-1 #email-1', meta.citations[0].email)
    await sendKeys('#citations-row-1 #email-1', "Tab")
    await delay(100)

    // set remove citations row 1
    await click('#citations-remove-row-0')
    await delay(100)
    await waitForNotExist('#citations-row-1')
    await delay(100)
  }

  if (meta.accessURL) {
    // set value for accessURL
    await setValue('#accessURL', meta.accessURL)
    await delay(100)
  }

  if (meta.downloadURL) {
    // set value for downloadURL
    await setValue('#downloadURL', meta.downloadURL)
    await delay(100)
  }

  if (meta.homeURL) {
    // set value for homeURL
    await setValue('#homeURL', meta.homeURL)
    await delay(100)
  }

  if (meta.readmeURL) {
    // set value for readmeURL
    await setValue('#readmeURL', meta.readmeURL)
    await delay(100)
  }

  if (meta.language && meta.language.length > 0) {
    // set value for language
    await setValue('#language-tag-input', meta.language[0])
    await sendKeys('#language-tag-input', "Enter")
    await delay(100)
    await waitForExist('#language-tag-0')
    await expectTextToBe('#language-tag-0', meta.language[0])
  }

  if (meta.accrualPeriodicity) {
    // set value for accrualPeriodicity
    await setValue('#accrualPeriodicity', meta.accrualPeriodicity)
    await delay(100)
  }

  if (meta.version) {
    // set value for version
    await setValue('#version', meta.version)
    await delay(100)
  }

  if (meta.identifier) {
    // set value for identifier
    await setValue('#identifier', meta.identifier)
    await delay(100)
  }

  // check that the status dot is correct
  await checkStatus('meta', status, artifactPathFromDir(imagesDir, `${name}-check-status-${status}.png`))

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-meta-edit.png`))
  }

  // commit!
  await writeCommitAndSubmit('fsi-meta-edit', 'meta', 'added', commit.title, commit.message, utils, imagesDir)

  // navigate to the meta component
  await click(`#meta-status`, artifactPathFromDir(imagesDir, `${name}-commit-click-meta-status.png`))

  // check if all non null fields properly exist on page
  if (meta.title) await expectTextToBe('#meta-title', meta.title, artifactPathFromDir(imagesDir, `${name}-commit-expect-text-to-be-meta-title.png`))
  if (meta.description) await expectTextToBe('#meta-description', meta.description, artifactPathFromDir(imagesDir, `${name}-commit-expect-text-to-be-meta-description.png`))
  if (meta.theme && meta.theme.length > 0) {
    await expectTextToBe('#meta-theme', meta.theme.join(''))
  }
  if (meta.keywords && meta.keywords.length > 0) {
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

async function editCSVStructureAndCommit (uniqueName: string, dataset: Dataset, status: 'added' | 'modified' | 'removed', utils: E2ETestUtils, imagesDir: string) {
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

  // on status tab
  await click('#working-version', artifactPathFromDir(imagesDir, `${name}-click-status-tab.png`))
  // commit should be disabled
  await doesNotExist('.clear-to-commit #commit-status', artifactPathFromDir(imagesDir, `${name}-commit-does-not-exist-clear-to-commit.png`))
  // click #structure-status
  await click('#structure-status', artifactPathFromDir(imagesDir, `${name}-click-structure-status.png`))

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-dataset-structure-edit.png`))
  }

  if (formatConfig) {
    const headerRowChecked = await isChecked('#headerRow', artifactPathFromDir(imagesDir, `${name}-is-headerRow-checked.png`))
    const variadicFieldsChecked = await isChecked('#variadicFields', artifactPathFromDir(imagesDir, `${name}-is-variadicFields-checked.png`))
    const lazyQuotesChecked = await isChecked('#lazyQuotes', artifactPathFromDir(imagesDir, `${name}-is-lazyQuotes-checked.png`))
    await delay(100)

    if ((formatConfig.headerRow && !headerRowChecked) || (!formatConfig.headerRow && headerRowChecked)) {
      await click('#headerRow', artifactPathFromDir(imagesDir, `${name}-click-headerRow.png`))
      await delay(100)
    }
    if ((formatConfig.variadicFields && !variadicFieldsChecked) || !(formatConfig.variadicFields && variadicFieldsChecked)) {
      await click('#variadicFields', artifactPathFromDir(imagesDir, `${name}-click-variadicFields.png`))
      await delay(100)
    }
    if ((formatConfig.lazyQuotes && !lazyQuotesChecked) || !(formatConfig.lazyQuotes && lazyQuotesChecked)) {
      await click('#lazyQuotes', artifactPathFromDir(imagesDir, `${name}-click-lazyQuotes.png`))
      await delay(100)
    }
  }

  const schemaItems = schemaColumns(schema as Schema)
  for (var i = 0; i < schemaItems.length; i++) {
    const item = schemaItems[i]
    if (item.title) {
      await setValue(`#title-${i}`, item.title)
      await sendKeys(`#title-${i}`, "Tab")
      await delay(100)
    }
    if (item.description) {
      await setValue(`#description-${i}`, item.description)
      await sendKeys(`#description-${i}`, "Tab")
      await delay(100)
    }
    if (item.validation) {
      await setValue(`#validation-${i}`, item.validation)
      await sendKeys(`#validation-${i}`, "Tab")
      await delay(100)
    }
  }

  // check that the status dot is correct
  await checkStatus('structure', status, artifactPathFromDir(imagesDir, `${name}-check-status-${status}.png`))

  await writeCommitAndSubmit(name, 'structure', 'modified', commit.title, commit.message, utils, imagesDir)

  await click('#structure-status', artifactPathFromDir(imagesDir, `${name}-commit-click-structure-status.png`))

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

  for (i = 0; i < schemaItems.length; i++) {
    const item = schemaItems[i]
    if (item.title) await expectTextToBe(`#title-${i}`, item.title)
    if (item.description) await expectTextToBe(`#description-${i}`, item.description)
    if (item.validation) await expectTextToBe(`#validation-${i}`, item.validation)
  }

  if (takeScreenshots) {
    await takeScreenshot(artifactPathFromDir(imagesDir, `${name}-dataset-history-structure.png`))
  }
}

const earthquakeDatasetEdit = `time,latitude,longitude,depth,mag,mag_type,nst,gap,dmin,rms,net,id,updated,place,type,horizontal_error,depth_error,mag_error,mag_nst,status,location_source,mag_source\n2019-09-06T17:51:31.610Z,35.809166,-117.6346664,5.74,1.2,ml,14,82,0.0309,0.09,ci,ci38814911,2019-09-06T17:53:36.399Z,"21km N of Ridgecrest, CA",earthquake,0.31,0.69,0.195,7,automatic,ci,ci\n2019-09-06T17:49:30.836Z,63.0001,-149.8869,74.1,1.3,ml,,,,0.67,ak,ak019bg38cop,2019-09-06T17:54:23.895Z,"64km SW of Cantwell, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T17:43:23.350Z,33.7381667,-116.568,25.18,0.96,ml,13,139,0.1248,0.38,ci,ci38814887,2019-09-06T17:47:08.725Z,"10km SSW of Palm Springs, CA",earthquake,1.64,3.17,0.349,17,automatic,ci,ci\n2019-09-06T17:33:55.970Z,35.7791667,-117.5498333,12.91,1.11,ml,6,174,0.05324,0.16,ci,ci38814879,2019-09-06T17:37:39.667Z,"13km W of Searles Valley, CA",earthquake,0.78,1.07,0.041,2,automatic,ci,ci\n2019-09-06T17:33:54.480Z,38.7796669,-122.7388306,0.98,0.23,md,5,193,0.003926,0,nc,nc73266360,2019-09-06T17:42:03.427Z,"2km E of The Geysers, CA",earthquake,2.41,0.65,0.15,3,automatic,nc,nc\n2019-09-06T17:33:30.760Z,35.7018333,-117.5416667,2.3,0.99,ml,18,104,0.0827,0.2,ci,ci38814871,2019-09-06T17:37:16.464Z,"14km WSW of Searles Valley, CA",earthquake,0.31,0.45,0.236,13,automatic,ci,ci\n2019-09-06T17:30:36.330Z,35.645,-117.5403333,4.57,0.99,ml,20,72,0.03278,0.17,ci,ci38814863,2019-09-06T17:34:18.108Z,"12km ENE of Ridgecrest, CA",earthquake,0.31,0.52,0.169,12,automatic,ci,ci\n2019-09-06T17:23:02.230Z,35.6256667,-117.4361667,10.33,0.64,ml,15,111,0.04447,0.2,ci,ci38814847,2019-09-06T17:26:39.064Z,"16km S of Searles Valley, CA",earthquake,0.49,0.69,0.077,8,automatic,ci,ci\n2019-09-06T17:06:30.660Z,35.601,-117.604,1.35,0.86,ml,18,54,0.03534,0.17,ci,ci38814815,2019-09-06T17:10:15.959Z,"7km ESE of Ridgecrest, CA",earthquake,0.26,0.42,0.188,13,automatic,ci,ci\n2019-09-06T17:02:10.700Z,35.6896667,-117.5331667,3.64,0.73,ml,18,100,0.07355,0.14,ci,ci38814807,2019-09-06T17:05:57.887Z,"14km SW of Searles Valley, CA",earthquake,0.29,1.11,0.075,10,automatic,ci,ci\n2019-09-06T16:52:16.417Z,65.1411,-148.939,8.3,1.4,ml,,,,0.52,ak,ak019bg2nd7k,2019-09-06T16:56:20.191Z,"54km NW of Ester, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T16:38:28.240Z,39.4796677,-122.946167,0.77,1.99,md,16,60,0.3031,0.13,nc,nc73266340,2019-09-06T17:04:02.637Z,"8km N of Lake Pillsbury, CA",earthquake,0.43,7.78,0.03,4,automatic,nc,nc\n2019-09-06T16:28:51.784Z,60.29,-143.319,10.9,1.4,ml,,,,0.98,ak,ak019bg2igpi,2019-09-06T16:42:56.504Z,"55km WNW of Cape Yakataga, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T16:23:54.810Z,36.187,-117.9935,1.04,1.11,ml,14,134,0.1319,0.18,ci,ci38814711,2019-09-06T16:27:24.703Z,"11km S of Olancha, CA",earthquake,0.48,0.92,0.138,17,automatic,ci,ci\n2019-09-06T16:15:41.280Z,36.106,-117.8491667,4.06,1.28,ml,19,71,0.01244,0.11,ci,ci38814703,2019-09-06T16:19:25.645Z,"11km NE of Coso Junction, CA",earthquake,0.2,0.28,0.264,19,automatic,ci,ci\n2019-09-06T16:15:03.350Z,38.8434982,-122.8301697,2.25,0.57,md,7,164,0.006424,0.01,nc,nc73266335,2019-09-06T16:42:02.396Z,"10km WNW of Cobb, CA",earthquake,1.49,2.79,,1,automatic,nc,nc\n2019-09-06T16:11:19.480Z,35.701,-117.5325,9.15,1.39,ml,26,73,0.08424,0.17,ci,ci38814695,2019-09-06T16:21:47.040Z,"14km WSW of Searles Valley, CA",earthquake,0.3,0.79,0.165,20,automatic,ci,ci\n2019-09-06T16:10:48.203Z,31.3391,-103.0897,5,2.9,mb_lg,,45,0.127,0.69,us,us70005cut,2019-09-06T16:38:21.040Z,"33km SSW of Monahans, Texas",earthquake,0.9,1.6,0.088,34,reviewed,us,us\n2019-09-06T16:09:20.816Z,62.1752,-152.3258,5.7,1.4,ml,,,,0.88,ak,ak019bg2ebp3,2019-09-06T16:13:38.854Z,"116km W of Talkeetna, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T15:57:00.880Z,38.8188324,-122.7646637,2.1,1.14,md,14,61,0.01232,0.03,nc,nc73266330,2019-09-06T16:20:04.218Z,"4km W of Cobb, CA",earthquake,0.27,0.57,0.11,5,automatic,nc,nc\n2019-09-06T15:55:09.944Z,31.3294,-103.0896,5,3.1,mb_lg,,45,0.117,0.71,us,us70005cul,2019-09-06T16:40:10.040Z,"34km SSW of Monahans, Texas",earthquake,1.2,1.7,0.068,57,reviewed,us,us\n2019-09-06T15:51:39.760Z,62.1314,-151.676,107.1,1.7,ml,,,,0.67,ak,ak019bg21xl5,2019-09-06T16:04:46.098Z,"84km WSW of Talkeetna, Alaska",earthquake,,0.6,,,automatic,ak,ak\n2019-09-06T15:51:38.630Z,32.8243333,-115.4688333,11.43,2.34,ml,29,44,0.02653,0.28,ci,ci38814663,2019-09-06T15:55:33.513Z,"8km W of Holtville, CA",earthquake,0.42,0.74,0.222,28,automatic,ci,ci\n2019-09-06T15:46:35.994Z,63.4836,-146.0184,0,1.7,ml,,,,0.81,ak,ak019bg20urk,2019-09-06T16:04:45.732Z,"58km SW of Deltana, Alaska",earthquake,,0.4,,,automatic,ak,ak\n2019-09-06T15:43:52.745Z,61.3871,-152.3036,26.9,0.6,ml,,,,1.01,ak,ak019bg208zt,2019-09-06T16:04:45.348Z,"95km NW of Nikiski, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T15:31:35.172Z,59.6792,-143.9137,27.7,1.9,ml,,,,1.2,ak,ak019bg1xlr0,2019-09-06T15:34:56.849Z,"93km WSW of Cape Yakataga, Alaska",earthquake,,1,,,automatic,ak,ak\n2019-09-06T15:31:32.060Z,32.8193333,-115.4603333,7.68,1.22,ml,13,62,0.01804,0.22,ci,ci38814647,2019-09-06T15:35:19.380Z,"8km W of Holtville, CA",earthquake,0.81,0.87,0.203,9,automatic,ci,ci\n2019-09-06T15:27:56.449Z,-20.1971,169.0722,29.11,5.9,mww,,42,2.841,1.3,us,us70005cu5,2019-09-06T17:39:00.306Z,"74km SSW of Isangel, Vanuatu",earthquake,7.6,3.4,0.058,29,reviewed,us,us\n2019-09-06T15:20:20.079Z,36.25183333,-98.64933333,7.7,1.93,ml,21,199,0.1196765154,0.09,ok,ok2019rmgz,2019-09-06T15:27:59.129Z,"15km W of Fairview, Oklahoma",earthquake,,0.3,0.31,5,reviewed,ok,ok\n2019-09-06T15:16:16.286Z,60.3614,-141.4365,5.6,1.5,ml,,,,1.13,ak,ak019bg1udev,2019-09-06T15:20:13.085Z,"64km ENE of Cape Yakataga, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T15:15:25.255Z,68.9842,-146.9774,0,1.7,ml,,,,1.1,ak,ak019bg1u6q9,2019-09-06T15:20:12.615Z,"112km NNW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T15:10:31.270Z,35.6595,-117.5145,5.64,0.71,ml,17,83,0.0581,0.21,ci,ci38814615,2019-09-06T15:14:15.255Z,"15km ENE of Ridgecrest, CA",earthquake,0.46,31.61,0.056,7,automatic,ci,ci\n2019-09-06T15:03:19.930Z,38.8256683,-122.8006668,3.24,0.83,md,15,66,0.007691,0.02,nc,nc73266300,2019-09-06T15:23:02.807Z,"7km NW of The Geysers, CA",earthquake,0.3,0.71,0.06,2,automatic,nc,nc\n2019-09-06T14:57:47.330Z,35.6971667,-117.4836667,6.37,1.54,ml,27,62,0.09761,0.17,ci,ci38814575,2019-09-06T15:01:35.917Z,"11km SW of Searles Valley, CA",earthquake,0.26,0.92,0.205,25,automatic,ci,ci\n2019-09-06T14:57:01.130Z,35.714,-117.5458333,8.07,1.56,ml,29,51,0.0937,0.19,ci,ci38814567,2019-09-06T15:08:26.770Z,"14km WSW of Searles Valley, CA",earthquake,0.26,0.93,0.111,24,automatic,ci,ci\n2019-09-06T14:51:06.645Z,68.9699,-146.7614,0.9,1.8,ml,,,,0.85,ak,ak019bg1gfkx,2019-09-06T14:55:46.335Z,"106km NNW of Arctic Village, Alaska",earthquake,,0.3,,,automatic,ak,ak\n2019-09-06T14:48:26.810Z,35.8578333,-117.6781667,7.37,0.31,ml,10,84,0.07784,0.11,ci,ci38814551,2019-09-06T14:52:00.921Z,"22km ESE of Little Lake, CA",earthquake,0.29,1.11,0.095,4,automatic,ci,ci\n2019-09-06T14:46:48.150Z,36.0893333,-117.8488333,2.34,0.89,ml,12,148,0.02861,0.14,ci,ci38814543,2019-09-06T14:50:25.585Z,"10km ENE of Coso Junction, CA",earthquake,0.45,0.26,0.246,11,automatic,ci,ci\n2019-09-06T14:25:28.620Z,45.861,-111.364,4.94,1.59,ml,15,112,0.308,0.22,mb,mb80359834,2019-09-06T14:45:55.280Z,"2km WNW of Manhattan, Montana",earthquake,0.54,4.54,0.058,6,reviewed,mb,mb\n`

const earthquakeDataset = `time,latitude,longitude,depth,mag,mag_type,nst,gap,dmin,rms,net,id,updated,place,type,horizontal_error,depth_error,mag_error,mag_nst,status,location_source,mag_source\n2019-09-06T17:51:31.610Z,35.809166,-117.6346664,5.74,1.2,ml,14,82,0.0309,0.09,ci,ci38814911,2019-09-06T17:53:36.399Z,"21km N of Ridgecrest, CA",earthquake,0.31,0.69,0.195,7,automatic,ci,ci\n2019-09-06T17:49:30.836Z,63.0001,-149.8869,74.1,1.3,ml,,,,0.67,ak,ak019bg38cop,2019-09-06T17:54:23.895Z,"64km SW of Cantwell, Alaska",earthquake,,0.5,,,automatic,ak,ak\n2019-09-06T17:43:23.350Z,33.7381667,-116.568,25.18,0.96,ml,13,139,0.1248,0.38,ci,ci38814887,2019-09-06T17:47:08.725Z,"10km SSW of Palm Springs, CA",earthquake,1.64,3.17,0.349,17,automatic,ci,ci\n2019-09-06T17:33:55.970Z,35.7791667,-117.5498333,12.91,1.11,ml,6,174,0.05324,0.16,ci,ci38814879,2019-09-06T17:37:39.667Z,"13km W of Searles Valley, CA",earthquake,0.78,1.07,0.041,2,automatic,ci,ci\n2019-09-06T17:33:54.480Z,38.7796669,-122.7388306,0.98,0.23,md,5,193,0.003926,0,nc,nc73266360,2019-09-06T17:42:03.427Z,"2km E of The Geysers, CA",earthquake,2.41,0.65,0.15,3,automatic,nc,nc\n2019-09-06T17:33:30.760Z,35.7018333,-117.5416667,2.3,0.99,ml,18,104,0.0827,0.2,ci,ci38814871,2019-09-06T17:37:16.464Z,"14km WSW of Searles Valley, CA",earthquake,0.31,0.45,0.236,13,automatic,ci,ci\n2019-09-06T17:30:36.330Z,35.645,-117.5403333,4.57,0.99,ml,20,72,0.03278,0.17,ci,ci38814863,2019-09-06T17:34:18.108Z,"12km ENE of Ridgecrest, CA",earthquake,0.31,0.52,0.169,12,automatic,ci,ci\n2019-09-06T17:23:02.230Z,35.6256667,-117.4361667,10.33,0.64,ml,15,111,0.04447,0.2,ci,ci38814847,2019-09-06T17:26:39.064Z,"16km S of Searles Valley, CA",earthquake,0.49,0.69,0.077,8,automatic,ci,ci\n2019-09-06T17:06:30.660Z,35.601,-117.604,1.35,0.86,ml,18,54,0.03534,0.17,ci,ci38814815,2019-09-06T17:10:15.959Z,"7km ESE of Ridgecrest, CA",earthquake,0.26,0.42,0.188,13,automatic,ci,ci\n2019-09-06T17:02:10.700Z,35.6896667,-117.5331667,3.64,0.73,ml,18,100,0.07355,0.14,ci,ci38814807,2019-09-06T17:05:57.887Z,"14km SW of Searles Valley, CA",earthquake,0.29,1.11,0.075,10,automatic,ci,ci\n2019-09-06T16:52:16.417Z,65.1411,-148.939,8.3,1.4,ml,,,,0.52,ak,ak019bg2nd7k,2019-09-06T16:56:20.191Z,"54km NW of Ester, Alaska",earthquake,,0.2,,,automatic,ak,ak\n2019-09-06T16:38:28.240Z,39.4796677,-122.946167,0.77,1.99,md,16,60,0.3031,0.13,nc,nc73266340,2019-09-06T17:04:02.637Z,"8km N of Lake Pillsbury, CA",earthquake,0.43,7.78,0.03,4,automatic,nc,nc\n`
