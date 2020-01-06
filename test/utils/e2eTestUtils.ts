import url from 'url'

export interface E2ETestUtils {
  atLocation: (expected: string) => Promise<void>
  waitForExist: (selector: string) => Promise<void>
  click: (selector: string) => Promise<void>
  setValue: (selector: string, value: any) => Promise<void>
  exists: (selectors: string[]) => Promise<void>
  doesNotExist: (selector: string) => Promise<void>
  expectTextToBe: (selector: string, text: string) => Promise<void>
  onHistoryTab: () => Promise<void>
  onStatusTab: () => Promise<void>
  checkStatus: (component: string, status: string) => Promise<void>
  delay: (time: number) => Promise<unknown>
}

export function newE2ETestUtils (app: any): E2ETestUtils {
  return {
    delay: delay,
    atLocation: atLocation(app),
    waitForExist: waitForExist(app),
    click: click(app),
    setValue: setValue(app),
    exists: exists(app),
    doesNotExist: doesNotExist(app),
    expectTextToBe: expectTextToBe(app),
    onHistoryTab: onHistoryTab(app),
    onStatusTab: onStatusTab(app),
    checkStatus: checkStatus(app)
  }
}

const delay = async (time: number) => new Promise(resolve => setTimeout(resolve, time))

// atLocation checks to see if the given hash location is where we expected it.
// Use this after a click that should have directed the user to a different
// route
function atLocation (app: any) {
  return async (expected: string) => {
    const { client, browserWindow } = app
    await client.waitUntil(async () => {
      const currUrl: string = await browserWindow.getURL()
      const location = new url.URL(currUrl).hash
      return location === expected
    }, 10000, `expected url to be '${expected}'`)
  }
}

// waitForExist checks to see if an element exists on the page. If it does not
// exists after the timeout, it sends an error
function waitForExist (app: any) {
  return async (selector: string) => {
    const { client } = app
    await client.waitUntil(async () => {
      return client.element(selector).isExisting()
    }, 10000, `element '${selector}' cannot be found`)
  }
}

// click waits until the link is enabled and then clicks the element
function click (app: any) {
  return async (selector: string) => {
    const { client } = app
    await client.waitUntil(async () => {
      const classes = await client.element(selector).getAttribute('class')
      return !(classes.includes('linkDisabled') || classes.includes('disabled'))
    }, 10000)
    await client.click(selector)
  }
}

// setValue sets the value of the element and waits for any debouncing
function setValue (app: any) {
  return async (selector: string, value: any) => {
    await app.client.element(selector).setValue(value)
  }
}

// exists iterates through the given selectors and checks to see that they
// exist on the pagge
function exists (app: any) {
  return async (selectors: string[]) => {
    selectors.forEach(async (selector: string) => {
      expect(await app.client.element(selector)).toBeDefined()
    })
  }
}

// doesNotExist checks that the element does not exist on the page
// specifically useful for when you want an element with an id to no longer
// have a particular class eg '#status-tab.disabled'
function doesNotExist (app: any) {
  return async (selector: string) => {
    const err = await app.client.element(selector)
    expect(err.type).toBe('NoSuchElement')
  }
}

// expectTextToBe wraps expect().toBe()
function expectTextToBe (app: any) {
  return async (selector: string, text: string) => {
    // await app.client.waitUntil(async () => {
    //   return !!await app.client.element(selector)
    // }, 10000, `element '${selector}' does not exist`)
    expect(await app.client.element(selector).getText()).toBe(text)
  }
}

// onHistoryTab uses onTab to check if the we are on the history tab
function onHistoryTab (app: any) {
  return async () => {
    await onTab(app, 'history')
  }
}

// onStatusTab uses onTab to check if the we are on the history tab
function onStatusTab (app: any) {
  return async () => {
    await onTab(app, 'status')
  }
}

// onTab checks to see if the element exists with the 'active' class
async function onTab (app: any, tab: string) {
  expect(await app.client.element(`#${tab}-tab.active`)).toBeDefined()
}

// checkStatus ensures that component exists with the correct status dot class
function checkStatus (app: any) {
  return async (component: string, status: string) => {
    expect(await app.client.element(`#${component}-status.status-dot-${status}`)).toBeDefined()
  }
}
