const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const { download } = require('electron-dl')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

const { BackendProcess } = require('./backend')
const { BACKEND_URL, DISCORD_URL, QRI_IO_URL } = require('./constants')

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'

// versions
// must be manually updated for now
const { desktopVersion, backendVersion } = require('../version')

let menu
let template
let mainWindow = null
let backendProcess

const isMac = process.platform === 'darwin'

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

if (app.setAboutPanelOptions) {
  // Mac only
  app.setAboutPanelOptions({
    applicationName: 'Qri Desktop',
    applicationVersion: desktopVersion,
    credits: QRI_IO_URL,
    website: QRI_IO_URL,
    iconPath: '../assets/qri-blob-logo-large.png'
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  log.info('quitting app')
  if (backendProcess) {
    backendProcess.close()
    backendProcess = null
  }
})

const installExtensions = () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer') // eslint-disable-line global-require
    log.info('downloading extensions', !!process.env.UPGRADE_EXTENSIONS)

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ]
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)))
  }

  return Promise.resolve([])
}

// pass in an array of menu item ids and true/false,
// it will set their enabled (working vs grayed out) status
const setMenuItemEnabled = (menuItemIds, enabled) => {
  const menu = Menu.getApplicationMenu()
  menuItemIds.forEach(menuItemId => {
    let item = menu.getMenuItemById(menuItemId)
    if (item) {
      item.enabled = enabled
    }
  })
}

// pass in an array of menu item ids and true/false,
// it will set their visible  status
const setMenuItemVisible = (menuItemIds, visible) => {
  const menu = Menu.getApplicationMenu()
  menuItemIds.forEach(menuItemId => {
    let item = menu.getMenuItemById(menuItemId)
    if (item) {
      item.visible = visible
    }
  })
  Menu.setApplicationMenu(menu)
}

let quitting = false

app.on('ready', () =>
  installExtensions()
    .then(() => {
      log.info('main process ready')
      autoUpdater.logger = log
      autoUpdater.checkForUpdatesAndNotify()

      mainWindow = new BrowserWindow({
        show: false,
        width: process.env.NODE_ENV === 'development' ? 1424 : 1024,
        height: 728,
        minWidth: 960,
        minHeight: 660,
        webPreferences: {
          nodeIntegration: true
        },
        titleBarStyle: 'hidden'
      })

      if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(`file://${__dirname}/app.development.html`)
      } else {
        mainWindow.loadURL(`file://${__dirname}/app.production.html`)
      }

      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
        mainWindow.focus()
      })

      mainWindow.on('closed', () => {
        mainWindow = null
      })

      if (process.env.NODE_ENV === 'development') {
        mainWindow.openDevTools()
        mainWindow.webContents.on('context-menu', (e, props) => {
          const { x, y } = props

          Menu.buildFromTemplate([
            {
              label: 'Inspect element',
              click () {
                mainWindow.inspectElement(x, y)
              }
            }
          ]).popup(mainWindow)
        })
      }

      const macAppMenu = {
        label: 'Qri Desktop',
        submenu: [
          {
            id: 'about-qri-desktop',
            label: 'About Qri Desktop',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            role: 'services'
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide Qri Desktop',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            id: 'show-all',
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit Qri Desktop',
            accelerator: 'Command+Q',
            click () {
              app.quit()
            }
          }
        ]
      }

      const fileMenu = {
        label: 'File',
        submenu: [
          {
            id: 'new-dataset',
            label: 'New Dataset...',
            accelerator: 'CmdOrCtrl+N',
            click () {
              mainWindow.webContents.send('create-dataset')
            }
          },
          {
            id: 'pull-dataset',
            label: 'Add a Dataset...',
            accelerator: 'CmdOrCtrl+D',
            click () {
              mainWindow.webContents.send('pull-dataset')
            }
          }
        ]
      }

      const windowsFileMenu = {
        label: 'File',
        submenu: [
          {
            id: 'new-dataset',
            label: 'New Dataset...',
            accelerator: 'CmdOrCtrl+N',
            click () {
              mainWindow.webContents.send('create-dataset')
            }
          },
          {
            id: 'pull-dataset',
            label: 'Add a Dataset...',
            accelerator: 'CmdOrCtrl+D',
            click () {
              mainWindow.webContents.send('pull-dataset')
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Exit',
            accelerator: 'Alt+F4',
            click () {
              app.quit()
            }
          }
        ]
      }

      const editMenu = {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            selector: 'undo:',
            role: 'undo'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            selector: 'cut:',
            role: 'cut'
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            selector: 'copy:',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:',
            role: 'paste'
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:',
            role: 'selectAll'
          }
        ]
      }

      const viewMenu = {
        label: 'View',
        submenu: [
          {
            id: 'show-collection',
            label: 'Collection',
            accelerator: 'CmdOrCtrl+1',
            click () {
              mainWindow.webContents.send('history-push', '/collection')
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Toggle Full Screen',
            accelerator: isMac ? 'Ctrl+Command+F' : 'F11',
            role: 'togglefullscreen'
          },
          {
            type: 'separator'
          },
          {
            label: 'Reset Zoom',
            accelerator: 'CmdOrCtrl+0',
            role: 'resetZoom'
          },
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+=',
            role: 'zoomIn'
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-',
            role: 'zoomOut'
          },
          {
            type: 'separator'
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click () {
              mainWindow.webContents.send('reload')
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: isMac ? 'Option+Command+I' : 'Ctrl+Shift+I',
            role: 'toggleDevTools'
          }
        ]
      }

      const datasetMenu = {
        visible: false,
        id: 'dataset-menu',
        label: 'Dataset',
        submenu: [
          {
            id: 'publish-unpublish-dataset',
            label: 'Publish/Unpublish Dataset',
            accelerator: 'Shift+CmdOrCtrl+P',
            click () {
              mainWindow.webContents.send('publish-unpublish-dataset')
            }
          },
          {
            id: 'view-on-qri-cloud',
            label: 'View on Qri Cloud',
            accelerator: 'Shift+CmdOrCtrl+C'
          },
          {
            type: 'separator'
          },
          {
            id: 'open-working-directory',
            label: isMac ? 'Show in Finder' : 'Show in Explorer',
            accelerator: isMac ? 'Shift+Command+F' : 'Ctrl+Shift+F',
            click: () => {
              mainWindow.webContents.send('open-working-directory')
            }
          }
        ]
      }

      const windowMenu = {
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:'
          },
          {
            label: 'Zoom',
            selector: 'performZoom:'
          },
          {
            label: 'Close',
            accelerator: 'Command+W',
            selector: 'performClose:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            selector: 'arrangeInFront:'
          }
        ]
      }

      const helpMenu = {
        role: 'help',
        submenu: [
          {
            label: 'Report an Issue...',
            click: () => {
              shell.openExternal('https://github.com/qri-io/desktop/issues/new/')
            }
          },
          {
            label: 'View Documentation...',
            click: () => {
              shell.openExternal(`${QRI_IO_URL}/`)
            }
          },
          {
            label: 'Contact Us...',
            click: () => {
              shell.openExternal(`${QRI_IO_URL}/contact/`)
            }
          },
          {
            label: 'Chat with the community...',
            click: () => {
              shell.openExternal(DISCORD_URL)
            }
          },
          { type: 'separator' },
          {
            label: `Qri backend ${backendVersion}`
          },
          {
            label: 'Export debug log',
            click () {
              mainWindow.webContents.send('export-debug-log')
            }
          }
        ]
      }

      if (isMac) {
        template = [
          macAppMenu,
          fileMenu,
          editMenu,
          viewMenu,
          datasetMenu,
          windowMenu,
          helpMenu
        ]

        menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
      } else {
        template = [
          windowsFileMenu,
          editMenu,
          viewMenu,
          datasetMenu,
          helpMenu
        ]
        menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
      }

      // listen for working dataset change
      ipcMain.on('set-working-dataset', (e, {
        fsiPath,
        published
      }) => {
        setMenuItemEnabled(['open-working-directory'], fsiPath != '')

        // enable/disable 'view in qri cloud' menu item
        setMenuItemEnabled(['view-on-qri-cloud'], published)
      })

      // catch export events
      ipcMain.on('export', async (e, { refString, filename, directory, config = 'zip' }) => {
        let exportUrl = `${BACKEND_URL}/get/${refString}?format=zip`
        if (config === 'csv') {
          exportUrl = `${BACKEND_URL}/get/${refString}/body.csv`
        }
        const win = BrowserWindow.getFocusedWindow()
        await download(win, exportUrl, {
          filename,
          directory,
          openFolderWhenDone: true
        })
      })

      ipcMain.on('block-menus', (e, blockMenus) => {
        const blockableMenus = [
          'show-all',
          'new-dataset',
          'pull-dataset',
          'show-status',
          'show-history',
          'publish-unpublish-dataset',
          'view-on-qri-cloud',
          'open-working-directory'
        ]
        setMenuItemEnabled(blockableMenus, !blockMenus)
      })

      // used to show and hide the dataset menu
      ipcMain.on('show-dataset-menu', (e, show) => {
        setMenuItemVisible(['dataset-menu'], show)
      })

      mainWindow.on('close', (e) => {
        if (!quitting) {
          if (Menu && Menu.sendActionToFirstResponder) {
            e.preventDefault()
            Menu.sendActionToFirstResponder('hide:')
          }
        }
      })

      app.on('activate', () => {
        mainWindow.show()
      })

      app.on('before-quit', () => {
        quitting = true
      })

      ipcMain.on('app-fully-loaded', () => {
        log.info("starting backend process")
        backendProcess = new BackendProcess()
        backendProcess.checkNoActiveBackendProcess()
        .then(() => {
          // at this point, we know that the backendProcess
          // we have just created is the one we are going to
          // be relying one
          // we need to hold onto a reference to this process
          // so we can close on app exit
          log.info("backend process not detected")
          this.backendProcess = backendProcess
        })
        .then(backendProcess.checkBackendCompatibility)
        .then(backendProcess.checkNeedsMigration)
        .then((needsMigration) => {
          if (needsMigration) {
            log.info("migrating backend")
            // this doesn't trigger migrations, which happens automatically
            // when we run `launchProcess`, but instead alerts the user
            // that we are running a migration and it might take a moment
            mainWindow.webContents.send("migrating-backend")
          }
        })
        .then(backendProcess.launchProcess)
        .then(() => {
          mainWindow.webContents.send('set-debug-log-path', backendProcess.debugLogPath)
        })
        .catch(err => {
          switch (err.message) {
            case "backend-already-running":
              log.info("a qri backend is already running at port 2503")
              mainWindow.webContents.send("backend-already-running")
              break
            case "incompatible-backend":
              log.info("qri backend is incompatible")
              mainWindow.webContents.send("incompatible-backend", backendProcess.backendVer)
              break
            case "migration-failed":
              log.debug("migration-failed")
              mainWindow.webContents.send("migration-failed")
              break
            case "error-launching-backend":
              log.debug("error-launching-backend")
              mainWindow.webContents.send("error-launching-backend")
              break
            default:
              log.error(err.message)
          }
          // if we error here, we should close the process
          log.info("closing backend process")
          backendProcess.close()
        })
      })
      log.info('app launched')
    })
  )
