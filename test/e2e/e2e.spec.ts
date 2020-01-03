import path from 'path'
import url from 'url'
import fs from 'fs'
import TestBackendProcess from '../utils/testQriBackend'
import fakeDialog from 'spectron-fake-dialog'

const { Application } = require('spectron')

const delay = async (time: number) => new Promise(resolve => setTimeout(resolve, time))

describe('Qri End to End tests', function spec () {
  let app: any
  let backend: any
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

  it('accept terms of service by clicking accept and get taken to signup', async () => {
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

  // atLocation checks to see if the given hash location is where we expected it.
  // Use this after a click that should have directed the user to a different
  // route
  const atLocation = async (expected: string) => {
    const { client, browserWindow } = app
    await client.waitUntil(async () => {
      const currUrl: string = await browserWindow.getURL()
      const location = new url.URL(currUrl).hash
      return location === expected
    }, 10000, `expected url to be '${expected}'`)
  }

  // waitForExist checks to see if an element exists on the page. If it does not
  // exists after the timeout, it sends an error
  const waitForExist = async (element: string) => {
    const { client } = app
    await client.waitUntil(async () => {
      return client.element(element).isExisting()
    }, 10000, `element '${element}' cannot be found`)
  }

  // click waits until the link is enabled and then clicks the element
  const click = async (element: string) => {
    await app.client.waitUntil(async () => {
      const classes = await app.client.element(element).getAttribute('class')
      return !(classes.includes('linkDisabled') || classes.includes('disabled'))
    }, 10000)
    await app.client.click(element)
  }

  // setValue sets the value of the element and waits for any debouncing
  const setValue = async (element: string, value: any) => {
    await app.client.element(element).setValue(value)
  }

  // exists iterates through the given selectors and checks to see that they
  // exist on the pagge
  const exists = async (elements: string[]) => {
    elements.forEach(async (element: string) => {
      expect(await app.client.element(element)).toBeDefined()
    })
  }

  // doesNotExist checks that the element does not exist on the page
  // specifically useful for when you want an element with an id to no longer
  // have a particular class eg '#status-tab.disabled'
  const doesNotExist = async (selector: string) => {
    const err = await app.client.element(selector)
    expect(err.type).toBe('NoSuchElement')
  }

  // expectTextToBe wraps expect().toBe()
  const expectTextToBe = async (selector: string, text: string) => {
    // await app.client.waitUntil(async () => {
    //   return !!await app.client.element(selector)
    // }, 10000, `element '${selector}' does not exist`)
    expect(await app.client.element(selector).getText()).toBe(text)
  }

  // onHistoryTab uses onTab to check if the we are on the history tab
  const onHistoryTab = async () => {
    await onTab('history')
  }

  // onStatusTab uses onTab to check if the we are on the history tab
  const onStatusTab = async () => {
    await onTab('status')
  }

  // onTab checks to see if the element exists with the 'active' class
  const onTab = async (tab: string) => {
    expect(await app.client.element(`#${tab}-tab.active`)).toBeDefined()
  }

  // checkStatus ensures that component exists with the correct status dot class
  const checkStatus = async (component: string, status: string) => {
    expect(await app.client.element(`#${component}-status.status-dot-${status}`)).toBeDefined()
  }
})
