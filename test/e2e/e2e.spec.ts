import path from 'path'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import fakeDialog from 'spectron-fake-dialog'
import { E2ETestUtils, newE2ETestUtils } from '../utils/e2eTestUtils'

const { Application } = require('spectron')

describe('Qri End to End tests', function spec () {
  let app: any
  let backend: any

  // The utility functions we use to build our e2e tests
  // declared in this scope so they can be accessed by all tests
  // initialized in the `beforeAll` function
  let utils: E2ETestUtils

  const filename = 'e2e_test_csv_dataset.csv'
  const datasetName = 'e2e_test_csv_datasetcsv'

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
    utils = newE2ETestUtils(app)
    return app.start()
  })

  afterAll(async () => {
    await utils.delay(500)
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

  it('accept terms of service by clicking accept and get taken to signup', async () => {
    const {
      atLocation,
      waitForExist,
      click,
      exists
    } = utils

    // Make sure the page is loaded
    await waitForExist('#welcome-page')

    // expected ids
    await exists(['#tos', '#accept'])

    // click to accept the tos
    await click('#accept')

    // make sure we navigated to the correct page
    await atLocation('#/signup')
  })

  it('create a new account, taken to datasets page', async () => {
    const {
      atLocation,
      waitForExist,
      click,
      setValue,
      exists
    } = utils

    // Make sure the page is loaded
    await waitForExist('#signup-page')

    // expected ids
    await exists(['#username', '#email', '#password', '#accept'])

    // Input username, email, and password
    await setValue('#username', 'fred')
    await setValue('#email', 'fred@qri.io')
    await setValue('#password', '1234567890!!')

    // click accept
    await click('#accept')

    // make sure we are on the collection page
    await atLocation('#/collection')
  })

  it('create new CSV dataset from a data source', async () => {
    const {
      atLocation,
      click,
      expectTextToBe,
      onHistoryTab,
      checkStatus
    } = utils

    // make sure we are on the collection page
    await atLocation('#/collection')

    // click create-dataset to open up the Create Dataset modal
    await click('#create-dataset')

    // mock the dialog and create a temp csv file
    // clicking the '#chooseBodyFilePath' button will connect the fakeDialog
    // to the correct input
    const csvPath = path.join(backend.dir, filename)
    fs.writeFileSync(csvPath, 'e2e_test_bool_col,a,b,c\nfalse,1,2,3\ntrue,4,5,6')
    await fakeDialog.mock([ { method: 'showOpenDialogSync', value: [csvPath] } ])
    await click('#chooseBodyFilePath')

    // submit to create a new dataset
    await click('#submit')

    // ensure we have redirected to the dataset page
    await atLocation('#/dataset')

    // ensure we have navigated to the correct dataset
    // TODO (ramfox): it's weird that we have to pass in this newline character
    // to get the reference to match. It looks like because the #dataset-reference
    // div divides the peername and name among multiple divs, we get this odd
    // whitespace character
    const reference = `fred/\n${datasetName}`
    await expectTextToBe('#dataset-reference', reference)

    // enure we are on the history tab
    await onHistoryTab()

    // ensure the body and structure indicate that they were 'added'
    await checkStatus('body', 'added')
    await checkStatus('structure', 'added')
  })
})
