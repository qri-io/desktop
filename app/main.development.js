const { app, BrowserWindow, Menu, shell } = require('electron')
const { BackendProcess } = require('./backend')
const { ipcMain } = require('electron')

let menu
let template
let mainWindow = null
let backendProcess

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
    applicationVersion: '0.0.1',
    credits: 'https://qri.io',
    website: 'https://qri.io',
    iconPath: '../assets/qri-blob-logo-large.png'
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
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
      backendProcess = new BackendProcess()
      backendProcess.maybeStartup()

      mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        minWidth: 960,
        minHeight: 660,
        webPreferences: {
          nodeIntegration: true
        }
      })
      mainWindow.loadURL(`file://${__dirname}/app.html`)

      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
        mainWindow.focus()
      })

      mainWindow.on('closed', () => {
        mainWindow = null
        backendProcess.close()
        backendProcess = null
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

      if (process.platform === 'darwin') {
        template = [
          {
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
                submenu: []
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
                  quitting = true; app.quit()
                }
              }
            ]
          },
          {
            label: 'File',
            submenu: [
              {
                id: 'new-dataset',
                label: 'New Dataset...',
                accelerator: 'Command+N',
                click () {
                  mainWindow.webContents.send('create-dataset')
                }
              },
              {
                id: 'add-dataset',
                label: 'Add a Dataset...',
                accelerator: 'Command+D',
                click () {
                  mainWindow.webContents.send('add-dataset')
                }
              }
            ]
          },
          {
            label: 'Edit',
            submenu: [
              {
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:'
              },
              {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
              },
              {
                type: 'separator'
              },
              {
                label: 'Cut',
                accelerator: 'Command+X',
                selector: 'cut:'
              },
              {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:'
              },
              {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:'
              },
              {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:'
              }
            ]
          },
          {
            label: 'View',
            submenu: [
              {
                id: 'show-status',
                label: 'Show Status',
                accelerator: 'Command+1',
                click () {
                  mainWindow.webContents.send('show-status')
                }
              },
              {
                id: 'show-history',
                label: 'Show History',
                accelerator: 'Command+2',
                click () {
                  mainWindow.webContents.send('show-history')
                }
              },
              {
                id: 'show-dataset-list',
                label: 'Show Dataset List',
                accelerator: 'Command+T',
                click () {
                  mainWindow.webContents.send('show-datasets')
                }
              },
              {
                type: 'separator'
              },
              {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                role: 'togglefullscreen'
              },
              {
                type: 'separator'
              },
              {
                label: 'Reset Zoom',
                accelerator: 'Command+0',
                role: 'resetZoom'
              },
              {
                label: 'Zoom In',
                accelerator: 'Command+=',
                role: 'zoomIn'
              },
              {
                label: 'Zoom Out',
                accelerator: 'Command+-',
                role: 'zoomOut'
              },
              {
                type: 'separator'
              },
              {
                label: 'Toggle Developer Tools',
                accelerator: 'Option+Command+I',
                role: 'toggleDevTools'
              }
            ]
          },
          {
            label: 'Dataset',
            submenu: [
              {
                id: 'publish-unpublish-dataset',
                label: 'Publish/Unpublish Dataset',
                accelerator: 'Shift+Command+P',
                click () {
                  mainWindow.webContents.send('publish-unpublish-dataset')
                }
              },
              {
                id: 'view-on-qri-cloud',
                label: 'View on Qri Cloud',
                accelerator: 'Shift+Command+C'
              },
              {
                type: 'separator'
              },
              {
                id: 'open-working-directory',
                label: process.platform === 'darwin'
                  ? 'Show in Finder'
                  : process.platform === 'win32'
                    ? 'Show in E&xplorer'
                    : 'Show in your File Manager',
                accelerator: 'Shift+Command+F',
                click: () => {
                  mainWindow.webContents.send('open-working-directory')
                }
              }
            ]
          },
          {
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
          },
          {
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
              }
            ]
          }
        ]

        menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
      } else {
        template = [
          {
            label: '&File',
            submenu: [
              {
                label: '&Open',
                accelerator: 'Ctrl+O'
              },
              {
                label: '&Close',
                accelerator: 'Ctrl+W',
                click () {
                  mainWindow.close()
                }
              }
            ]
          },
          {
            label: '&View',
            submenu: (process.env.NODE_ENV === 'development') ? [
              {
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click () {
                  mainWindow.webContents.reload()
                }
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click () {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen())
                }
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click () {
                  mainWindow.toggleDevTools()
                }
              }
            ] : [
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click () {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen())
                }
              }
            ]
          },
          {
            label: 'Help',
            submenu: [
              {
                label: 'Learn More',
                click () {
                  shell.openExternal('http://electron.atom.io')
                }
              },
              {
                label: 'Documentation',
                click () {
                  shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
                }
              },
              {
                label: 'Community Discussions',
                click () {
                  shell.openExternal('https://discuss.atom.io/c/electron')
                }
              },
              {
                label: 'Search Issues',
                click () {
                  shell.openExternal('https://github.com/atom/electron/issues')
                }
              }
            ]
          }
        ]
        menu = Menu.buildFromTemplate(template)
        mainWindow.setMenu(menu)
      }

      // listen for working dataset change
      ipcMain.on('set-working-dataset', (e, {
        fsiPath,
        published
      }) => {
        const isLinked = !!fsiPath
        setMenuItemEnabled(['open-working-directory'], isLinked)

        // enable/disable 'view in qri cloud' menu item
        setMenuItemEnabled(['view-on-qri-cloud'], published)
      })

      ipcMain.on('block-menus', (e, blockMenus) => {
        const blockableMenus = [
          'about-qri-desktop',
          'show-all',
          'new-dataset',
          'add-dataset',
          'show-status',
          'show-history',
          'show-dataset-list',
          'publish-unpublish-dataset',
          'view-on-qri-cloud',
          'open-working-directory'
        ]
        setMenuItemEnabled(blockableMenus, !blockMenus)
      })

      mainWindow.on('close', (e) => {
        if (!quitting) {
          e.preventDefault()
          Menu.sendActionToFirstResponder('hide:')
        }
      })

      app.on('activate', () => {
        mainWindow.show()
      })
    }))
