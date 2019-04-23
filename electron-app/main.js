const path = require('path')
const url = require('url')
const fs = require('fs')

// electron-log can be used to log to electron console and file system.
// Location of log file
// on Linux: ~/.config/<app name>/log.log
// on OS X: ~/Library/Logs/<app name>/log.log
// on Windows: %USERPROFILE%\AppData\Roaming\<app name>\log.log
const log = require('electron-log');
log.transports.file.level = 'info'
log.transports.console.level = false

// Electron and Electron Modules
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;

// Development options
const dev = (process.argv.indexOf('--devServer') !== -1)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


// Set single instance for app.
setAppSingleInstance(true)


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
    if(!dev) {
        launchAutoUpdater()
    }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('browser-window-created',function(e,window) {
    if(dev) {
        // window.webContents.openDevTools({
        //     mode: "undocked"
        // })
    } else {
        window.setMenu(null);
    }

    // window.webContents.openDevTools({
    //     mode: "undocked"
    // })
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({alwaysOnTop: false, width: 800, height: 600, frame: true, autoHideMenuBar: true, useContentSize: true, resizable: true, show: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Adds a slash since all urls are set as ex: 'assets/something.png' and use the base tag on the page.
    // File protocol goes to root: (C:) if no slash is appended.
    // Only needed for when app is running as 'installed'
    electron.protocol.interceptFileProtocol('file', (request, callback) => {
        // // Strip protocol
        let url = request.url.substr('file'.length + 1);
        // Build complete path for node require function
       
        url = path.join(__dirname, '/', url);
        // Replace backslashes by forward slashes (windows)
        // url = url.replace(/\\/g, '/');
        url = path.normalize(url);
        callback({path: url});
    });
  
    // If it's dev server, used the hard-coded server port, if not, local file system.
    loadIndexHTML()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })


    mainWindow.once('ready-to-show', function () {
        mainWindow.show()
    })

    // Do not allow for zooming in or out
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.setZoomFactor(1);
        mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
        mainWindow.webContents.setLayoutZoomLevelLimits(0, 0);
    });
}

function loadIndexHTML() {
  if(!dev) {
      mainWindow.loadURL(url.format({
          pathname: 'index.html',
          protocol: 'file:',
          slashes: true
      }))
  } else {
      mainWindow.loadURL(url.format({
          pathname: 'localhost:8080',
          protocol: 'http:',
          slashes: true
      }))
  }
}






// ** APPLICATION SINGLE INSTANCE MANAGEMENT ** //
function setAppSingleInstance (singleInstanceMode) {
    if(!singleInstanceMode) return;

    var duplicateWindow = app.makeSingleInstance(function(commandLine, workingDirectory) {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
    
    if (duplicateWindow) {
        app.quit()
        return;
    }
}



// ** APPLICATION AUTO UPDATES ** //

// Auto Update Event Binding and Logic
// Note: It should only work on non-dev mode
// If app is not installed with electron-builder, just running electron on this file will also 
// throw an error (Not blocking.)
const {autoUpdater} = require("electron-updater");

// Link electron-log to auto updater for debugging.
autoUpdater.logger = log;
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

function launchAutoUpdater() {
    autoUpdater.on('error', (ev, err) => {
        mainWindow.webContents.send('auto-updater-event', {
            type: 'error',
            description: 'Error in auto-updater',
            params: ev,
            error: err
        })
    })

    autoUpdater.on('checking-for-update', (ev) => {
        mainWindow.webContents.send('auto-updater-event', {
            type: 'checking-for-update',
            description: 'Checking for update',
            params: ev
        })
    })

    autoUpdater.on('update-available', (ev) => {
        mainWindow.webContents.send('auto-updater-event', {
            type: 'update-available',
            description: 'Update available',
            params: ev
        })
    })

    autoUpdater.on('update-not-available', (ev) => {
        mainWindow.webContents.send('auto-updater-event', {
            type: 'update-not-available',
            description: 'Update not available',
            params: ev
        })
    })

    autoUpdater.on('download-progress', (ev) => {
        mainWindow.webContents.send('auto-updater-event', {
            type: 'download-progress',
            description: 'Download progress...',
            params: ev
        })
    })

    autoUpdater.on('update-downloaded', (ev) => {
        mainWindow.webContents.send('auto-updater-event', {
            type: 'update-downloaded',
            description: 'Update downloaded',
            params: ev
        })
    });

    ipcMain.on('auto-updater-check', () => {
        autoUpdater.checkForUpdates()
    })

    ipcMain.on('auto-updater-download', () => {
        autoUpdater.downloadUpdate()
    })

    ipcMain.on('auto-updater-update', (ev, obj) => {
        autoUpdater.quitAndInstall();
    })

    // Let renderer process initiate this instead.
    // autoUpdater.checkForUpdates()
}



