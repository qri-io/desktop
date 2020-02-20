import url from 'url'
import fs from 'fs'

const headless = false
const delayTime = 300

export interface E2ETestUtils {
  atLocation: (expected: string, screenshotLocation?: string) => Promise<void>
  waitForExist: (selector: string, screenshotLocation?: string) => Promise<void>
  waitForNotExist: (selector: string, screenshotLocation?: string) => Promise<void>
  click: (selector: string, screenshotLocation?: string) => Promise<void>
  setValue: (selector: string, value: any, screenshotLocation?: string) => Promise<void>
  exists: (selectors: string[], screenshotLocation?: string) => Promise<void>
  doesNotExist: (selector: string, screenshotLocation?: string) => Promise<void>
  expectTextToBe: (selector: string, text: string, screenshotLocation?: string) => Promise<void>
  expectTextToContain: (selector: string, text: string, screenshotLocation?: string) => Promise<void>
  onHistoryTab: (screenshotLocation?: string) => Promise<void>
  onStatusTab: (screenshotLocation?: string) => Promise<void>
  checkStatus: (component: string, status: string, screenshotLocation?: string) => Promise<void>
  delay: (time: number, screenshotLocation?: string) => Promise<unknown>
  sendKeys: (selector: string, value: string | string[], screenshotLocation?: string) => Promise<void>
  takeScreenshot: (screenshotLocation: string, delayTime?: number) => Promise<void>
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
    expectTextToContain: expectTextToContain(app),
    onHistoryTab: onHistoryTab(app),
    onStatusTab: onStatusTab(app),
    checkStatus: checkStatus(app),
    sendKeys: sendKeys(app),
    takeScreenshot: takeScreenshot(app)
  }
}

const delay = async (time: number) => new Promise(resolve => setTimeout(resolve, time))

// takeScreenshot takes a screenshot of the content displayed. Use the optional
// `delayTime` to pause for the given ms before taking the screenshot
function takeScreenshot (app: any) {
  return async (screenshotLocation: string, delayTime: number = 0) => {
    if (delayTime !== 0) {
      await delay(delayTime)
    }
    app.browserWindow.capturePage().then(function (imageBuffer) {
      console.log(`writing screenshot: ${screenshotLocation}`)
      fs.writeFileSync(screenshotLocation, imageBuffer)
    })
  }
}

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
        return location.startsWith(expected)
      }, 10000, `expected url to start with '${expected}', got: ${location.hash}`)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'atLocation': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// waitForExist checks to see if an element exists on the page. If it does not
// exists after the timeout, it sends an error
function waitForExist (app: any) {
  return async (selector: string, screenshotLocation?: string) => {
    const { client } = app
    try {
      await client.waitUntil(async () => {
        return client.element(selector).isExisting()
      }, 10000, `element '${selector}' cannot be found`)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'waitForExist': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// waitForNotExist checks to see if an element does not exist on the page.
// If it does exist after the timeout, it sends an error
function waitForNotExist (app: any) {
  return async (selector: string, screenshotLocation?: string) => {
    const { client } = app
    try {
      await client.waitUntil(async () => {
        const err = await app.client.element(selector)
        return err.type === 'NoSuchElement'
      }, 10000, `element ${selector} should not exist, but is existing`)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'waitForNotExist': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// click waits until the link is enabled and then clicks the element
function click (app: any) {
  return async (selector: string, screenshotLocation?: string) => {
    const { client } = app
    try {
      await client.waitUntil(async () => {
        const classes = await client.element(selector).getAttribute('class')
        return !(classes.includes('linkDisabled') || classes.includes('disabled'))
      }, 10000)
      await client.click(selector)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'click', selector '${selector}': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// setValue sets the value of the element and waits for any debouncing
function setValue (app: any) {
  return async (selector: string, value: any, screenshotLocation?: string) => {
    try {
      await app.client.element(selector).setValue(value)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'setValue', selector '${selector}': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// sendKeys sends a sequence of key strokes to the active element
// supported characters listed here: https://w3c.github.io/webdriver/#keyboard-actions
function sendKeys (app: any) {
  return async (selector: string, value: string | string[], screenshotLocation?: string) => {
    try {
      await app.client.element(selector).keys(value)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'sendKeys', selector '${selector}': ${e}`)
    }
  }
}

// exists iterates through the given selectors and checks to see that they
// exist on the pagge
function exists (app: any) {
  return async (selectors: string[], screenshotLocation?: string) => {
    try {
      selectors.forEach(async (selector: string) => {
        expect(await app.client.element(selector)).toBeDefined()
      })
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'exists', selector '${selectors}': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// doesNotExist checks that the element does not exist on the page
// specifically useful for when you want an element with an id to no longer
// have a particular class eg '#status-tab.disabled'
function doesNotExist (app: any) {
  return async (selector: string, screenshotLocation?: string) => {
    const err = await app.client.element(selector)
    try {
      expect(err.type).toBe('NoSuchElement')
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'sendKeys', selector '${selectors}': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// expectTextToBe wraps expect().toBe()
function expectTextToBe (app: any) {
  return async (selector: string, text: string, screenshotLocation?: string) => {
    try {
      // await app.client.waitUntil(async () => {
      //   return !!await app.client.element(selector)
      // }, 10000, `element '${selector}' does not exist`)
      expect(await app.client.element(selector).getText()).toBe(text)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'expectTextToBe', selector '${selector}': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// expectTextToContain wraps expect().toContain()
function expectTextToContain (app: any) {
  return async (selector: string, text: string, screenshotLocation?: string) => {
    try {
      expect(await app.client.element(selector).getText()).toContain(text)
      if (!headless) await delay(delayTime)
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`${selector}, ${text}: ${e}`)
    }
  }
}

// onHistoryTab uses onTab to check if the we are on the history tab
function onHistoryTab (app: any) {
  return async (screenshotLocation?: string) => {
    try {
      await onTab(app, 'history')
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'onHistoryTab': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// onStatusTab uses onTab to check if the we are on the history tab
function onStatusTab (app: any) {
  return async (screenshotLocation?: string) => {
    try {
      await onTab(app, 'status')
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'onStatusTab': ${e}`)
    }
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
  return async (component: string, status: string, screenshotLocation?: string) => {
    try {
      expect(await app.client.element(`#${component}-status.status-dot-${status}`)).toBeDefined()
    } catch (e) {
      if (screenshotLocation) {
        app.browserWindow.capturePage().then(function (imageBuffer) {
          console.log(`writing screenshot: ${screenshotLocation}`)
          fs.writeFileSync(screenshotLocation, imageBuffer)
        })
      }
      throw new Error(`function 'checkStatus': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}
