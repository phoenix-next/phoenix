import { app, BrowserWindow, shell, Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { handleUtils } from './utils'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  // disable default menu
  Menu.setApplicationMenu(null)

  // config main window
  let winConfig = {
    title: 'PhoeniX',
    width: 1100,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs')
    }
  }
  if (!app.isPackaged) {
    Object.assign(winConfig, {
      icon: join(__dirname, '../renderer/images/icon.png')
    })
  }
  win = new BrowserWindow(winConfig)

  // enable cross origin
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      delete details.requestHeaders['Origin']
      callback({ requestHeaders: { ...details.requestHeaders, origin: '*' } })
    }
  )
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    if (details.responseHeaders) {
      delete details.responseHeaders['Access-Control-Allow-Origin']
      delete details.responseHeaders['Access-Control-Allow-Headers']
    }
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'access-control-allow-origin': '*',
        'access-control-allow-headers':
          'Origin,Content-Length,Content-Type,x-token'
      }
    })
  })

  // load app content
  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url)
    win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Disable in-app navigation
  win.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

handleUtils()
