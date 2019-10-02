const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const { BackendProcess } = require('./backend')
const { download } = require('electron-dl')

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
    credits: 'https://qri.io',
    website: 'https://qri.io',
    iconPath: '../assets/qri-blob-logo-large.png'
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.close()
    backendProcess = null
  }
})

const installExtensions = () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer') // eslint-disable-line global-require

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

let quitting = false

app.on('ready', () =>
  installExtensions()
    .then(() => {
      autoUpdater.checkForUpdatesAndNotify()
      backendProcess = new BackendProcess()
      backendProcess.maybeStartup()

      mainWindow = new BrowserWindow({
        show: false,
        width: process.env.NODE_ENV === 'development' ? 1424 : 1024,
        height: 728,
        minWidth: 960,
        minHeight: 660,
        webPreferences: {
          nodeIntegration: true
        }
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
            id: 'add-dataset',
            label: 'Add a Dataset...',
            accelerator: 'CmdOrCtrl+D',
            click () {
              mainWindow.webContents.send('add-dataset')
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
            id: 'add-dataset',
            label: 'Add a Dataset...',
            accelerator: 'CmdOrCtrl+D',
            click () {
              mainWindow.webContents.send('add-dataset')
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
            id: 'show-status',
            label: 'Show Status',
            accelerator: 'CmdOrCtrl+1',
            click () {
              mainWindow.webContents.send('show-status')
            }
          },
          {
            id: 'show-history',
            label: 'Show History',
            accelerator: 'CmdOrCtrl+2',
            click () {
              mainWindow.webContents.send('show-history')
            }
          },
          {
            id: 'toggle-dataset-list',
            label: 'Toggle Dataset List',
            accelerator: 'CmdOrCtrl+T',
            click () {
              mainWindow.webContents.send('toggle-dataset-list')
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
              shell.openExternal('https://qri.io/')
            }
          },
          {
            label: 'Contact Us...',
            click: () => {
              shell.openExternal('https://qri.io/contact/')
            }
          },
          {
            label: 'Chat with the community...',
            click: () => {
              shell.openExternal('https://discord.gg/etap8Gb')
            }
          },
          { type: 'separator' },
          {
            label: `Qri backend ${backendVersion}`
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
        setMenuItemEnabled(['open-working-directory'], !!fsiPath)

        // enable/disable 'view in qri cloud' menu item
        setMenuItemEnabled(['view-on-qri-cloud'], published)
      })

      // catch export events
      ipcMain.on('export', async (e, { url, directory }) => {
        const win = BrowserWindow.getFocusedWindow()
        await download(win, url, { directory })
      })

      ipcMain.on('block-menus', (e, blockMenus) => {
        const blockableMenus = [
          'about-qri-desktop',
          'show-all',
          'new-dataset',
          'add-dataset',
          'show-status',
          'show-history',
          'toggle-dataset-list',
          'publish-unpublish-dataset',
          'view-on-qri-cloud',
          'open-working-directory'
        ]
        setMenuItemEnabled(blockableMenus, !blockMenus)
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
    }))
