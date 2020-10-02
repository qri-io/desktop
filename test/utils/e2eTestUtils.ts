import url from 'url'
import fs from 'fs'

const headless = false
const delayTime = 300

export interface E2ETestUtils {
  atLocation: (expected: string, screenshotLocation?: string) => Promise<void>
  atDataset: (username: string, datasetName: string, screenshotLocation?: string) => Promise<void>
  waitForExist: (selector: string, screenshotLocation?: string) => Promise<void>
  waitForNotExist: (selector: string, screenshotLocation?: string) => Promise<void>
  click: (selector: string, screenshotLocation?: string) => Promise<void>
  setValue: (selector: string, value: any, screenshotLocation?: string) => Promise<void>
  exists: (selectors: string[], screenshotLocation?: string) => Promise<void>
  doesNotExist: (selector: string, screenshotLocation?: string) => Promise<void>
  expectTextToBe: (selector: string, text: string, screenshotLocation?: string) => Promise<void>
  checkDatasetReference: (username: string, name: string, screenshotLocation?: string) => Promise<void>
  atDatasetVersion: (ver: "working" | number, screenshotLocation?: string) => Promise<void>
  expectTextToContain: (selector: string, text: string, screenshotLocation?: string) => Promise<void>
  checkStatus: (component: string, status: string, screenshotLocation?: string) => Promise<void>
  delay: (time: number, screenshotLocation?: string) => Promise<unknown>
  sendKeys: (selector: string, value: string | string[], screenshotLocation?: string) => Promise<void>
  takeScreenshot: (screenshotLocation: string, delayTime?: number) => Promise<void>
  isChecked: (selector: string, screenshotLocation?: string) => Promise<boolean>
}

export function newE2ETestUtils (app: any): E2ETestUtils {
  return {
    delay: delay,
    atLocation: atLocation(app),
    atDataset: atDataset(app),
    checkDatasetReference: checkDatasetReference(app),
    waitForExist: waitForExist(app),
    waitForNotExist: waitForNotExist(app),
    click: click(app),
    setValue: setValue(app),
    exists: exists(app),
    doesNotExist: doesNotExist(app),
    expectTextToBe: expectTextToBe(app),
    atDatasetVersion: atDatasetVersion(app),
    expectTextToContain: expectTextToContain(app),
    checkStatus: checkStatus(app),
    sendKeys: sendKeys(app),
    takeScreenshot: takeScreenshot(app),
    isChecked: isChecked(app)
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
    _takeScreenshot(app, screenshotLocation)
  }
}

function _takeScreenshot (app: any, screenshotLocation: string) {
  app.browserWindow.capturePage().then(function (imageBuffer) {
    console.log(`writing screenshot: ${screenshotLocation}`)
    fs.writeFileSync(screenshotLocation, imageBuffer)
  })
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
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'atLocation': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// atDataset checks to see if we are at the correct route for the expected dataset
// the `username` can be empty, for cases where the username is randomaly generated
// and we don't know what it is at runtime
function atDataset (app: any) {
  return async (username: string, datasetName: string, screenshotLocation?: string) => {
    const { client, browserWindow } = app
    try {
      await client.waitUntil(async () => {
        const currUrl: string = await browserWindow.getURL()
        const location = new url.URL(currUrl).hash
        return location.startsWith('#/collection') && username === '' ? true : location.includes(username) && location.includes(datasetName)
      }, 10000, `expected url to be '#/collection/${username === '' ? 'some_username' : username}/${datasetName}', got: ${location}`)
    } catch (e) {
      if (screenshotLocation) {
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'atDataset': ${e}`)
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
        _takeScreenshot(app, screenshotLocation)
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
        _takeScreenshot(app, screenshotLocation)
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
        _takeScreenshot(app, screenshotLocation)
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
        _takeScreenshot(app, screenshotLocation)
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
        _takeScreenshot(app, screenshotLocation)
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
        _takeScreenshot(app, screenshotLocation)
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
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'sendKeys', selector '${selector}': ${e}`)
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
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'expectTextToBe', selector '${selector}': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// checkDatasetReference takes a username and a name, checking that the given
// dataset reference matches the one at the #dataset-reference id
function checkDatasetReference (app: any) {
  return async (username: string, name: string, screenshotLocation?: string) => {
    try {
      // TODO (ramfox): it's weird that we have to pass in this newline character
      // to get the reference to match. It looks like because the #dataset-reference
      // div divides the peername and name among multiple divs, we get this odd
      // whitespace character
      const ref = `${username}/\n${name}`
      expect(await app.client.element('#dataset-reference').getText()).toBe(ref)
    } catch (e) {
      if (screenshotLocation) {
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'checkDatasetReference': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// expectTextToContain wraps expect().toContain()
function expectTextToContain (app: any) {
  return async (selector: string, text: string, screenshotLocation?: string) => {
    try {
      expect(await app.client.element(selector).getText()).toContain(text)
    } catch (e) {
      if (screenshotLocation) {
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`${selector}, ${text}: ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// atDatasetVersion takes a number or the string "working"
// to determine if the expected version is the selected version.
// the latest version of the dataset is HEAD-0, with the previous version being
// HEAD-1. The "working" version is the version of the dataset that is being
// edited
function atDatasetVersion (app: any) {
  return async (ver: "working" | number, screenshotLocation: string) => {
    let verStr = ''
    if (ver === "working") {
      verStr = "#working-version"
    } else {
      verStr = `#HEAD-${ver}`
    }
    try {
      expect(await app.client.element(verStr).getAttribute("class")).toContain("selected")
    } catch (e) {
      if (screenshotLocation) {
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'atDatasetVersion': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// checkStatus ensures that component exists with the correct status dot class
function checkStatus (app: any) {
  return async (component: string, status: string, screenshotLocation?: string) => {
    try {
      expect(await app.client.element(`#${component}-status.status-dot-${status}`)).toBeDefined()
    } catch (e) {
      if (screenshotLocation) {
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'checkStatus': ${e}`)
    }
    if (!headless) await delay(delayTime)
  }
}

// isChecked returns whether or not the selection is checked or not
function isChecked (app: any) {
  return async (selector: string, screenshotLocation?: string): Promise<boolean> => {
    const { client } = app
    try {
      await client.waitUntil(async () => {
        return client.element(selector)
      }, 10000, `element '${selector}' cannot be found`)
      return await client.element(selector).isSelected()
    } catch (e) {
      if (screenshotLocation) {
        _takeScreenshot(app, screenshotLocation)
      }
      throw new Error(`function 'waitForExist': ${e}`)
    }
  }
}
