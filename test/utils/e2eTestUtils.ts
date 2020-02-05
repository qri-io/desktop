import url from 'url'
import fs from 'fs'

const headless = false
const delayTime = 300

export interface E2ETestUtils {
  atLocation: (expected: string) => Promise<void>
  waitForExist: (selector: string) => Promise<void>
  waitForNotExist: (selector: string) => Promise<void>
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
    waitForNotExist: waitForNotExist(app),
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
  return async (expected: string, screenshotLocation?: string) => {
    const { client, browserWindow } = app
    try {
      await client.waitUntil(async () => {
        const currUrl: string = await browserWindow.getURL()
        const location = new url.URL(currUrl).hash
        return location === expected
      }, 10000, `expected url to be '${expected}', got: ${location.hash || location}`)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw e
    }
    if (!headless) await delay(delayTime)
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
    if (!headless) await delay(delayTime)
  }
}

// waitForNotExist checks to see if an element does not exist on the page.
// If it does exist after the timeout, it sends an error
function waitForNotExist (app: any) {
  return async (selector: string) => {
    const { client } = app
    await client.waitUntil(async () => {
      const err = await app.client.element(selector)
      return err.type === 'NoSuchElement'
    }, 10000, `element ${selector} should not exist, but is existing`)
    if (!headless) await delay(delayTime)
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
    if (!headless) await delay(delayTime)
  }
}

// setValue sets the value of the element and waits for any debouncing
function setValue (app: any) {
  return async (selector: string, value: any) => {
    await app.client.element(selector).setValue(value)
    // if (!headless) await delay(delayTime)
  }
}

// exists iterates through the given selectors and checks to see that they
// exist on the pagge
function exists (app: any) {
  return async (selectors: string[]) => {
    selectors.forEach(async (selector: string) => {
      expect(await app.client.element(selector)).toBeDefined()
    })
    if (!headless) await delay(delayTime)
  }
}

// doesNotExist checks that the element does not exist on the page
// specifically useful for when you want an element with an id to no longer
// have a particular class eg '#status-tab.disabled'
function doesNotExist (app: any) {
  return async (selector: string) => {
    const err = await app.client.element(selector)
    expect(err.type).toBe('NoSuchElement')
    if (!headless) await delay(delayTime)
  }
}

// expectTextToBe wraps expect().toBe()
function expectTextToBe (app: any) {
  return async (selector: string, text: string) => {
    // await app.client.waitUntil(async () => {
    //   return !!await app.client.element(selector)
    // }, 10000, `element '${selector}' does not exist`)
    expect(await app.client.element(selector).getText()).toBe(text)
    if (!headless) await delay(delayTime)
  }
}

// onHistoryTab uses onTab to check if the we are on the history tab
function onHistoryTab (app: any) {
  return async () => {
    await onTab(app, 'history')
    if (!headless) await delay(delayTime)
  }
}

// onStatusTab uses onTab to check if the we are on the history tab
function onStatusTab (app: any) {
  return async () => {
    await onTab(app, 'status')
    if (!headless) await delay(delayTime)
  }
}

// onTab checks to see if the element exists with the 'active' class
async function onTab (app: any, tab: string) {
  expect(await app.client.element(`#${tab}-tab.active`)).toBeDefined()
  if (!headless) await delay(delayTime)
}

// checkStatus ensures that component exists with the correct status dot class
function checkStatus (app: any) {
  return async (component: string, status: string) => {
    expect(await app.client.element(`#${component}-status.status-dot-${status}`)).toBeDefined()
    if (!headless) await delay(delayTime)
  }
}
