// ipcRenderer is used to receive messages from the main process
const { ipcRenderer, remote } = require('electron');

const fs = require('fs')
const path = require('path')

// Preload.js has access to the Node APIs
// It runs before any other script does on the index.html.
window.electronAPIs = {}



// ** Auto Updater **
// Auto updater funcitonality.
// Methods to update and messages sent from events.
// Store them in a queue for the client to read them.
const _autoUpdaterCallbacks = {
    'update-available': (event) => {},
    'update-not-available': (event) => {},
    'error': (event) => {},
    'update-downloaded': (event) => {},
    'download-progress': (event) => {}
}

let _autoUpdaterAutomatic = true

window.electronAPIs.autoUpdater  = {
    checkForUpdates: function() {
        ipcRenderer.send('auto-updater-check', {})
    },
    requestUpdate: () => {
        ipcRenderer.send('auto-updater-update', {})
    },
    requestDownload: () => {
        ipcRenderer.send('auto-updater-download', {})
    },
    currentVersion: remote.app.getVersion(),
    nextVersion: null, 
    onVersionAvailable: (callback) => {
        _autoUpdaterCallbacks['update-available'] = callback
    },
    onVersionNotAvailable: (callback) => {
        _autoUpdaterCallbacks['update-not-available'] = callback
    },
    onUpdateDownloaded: (callback) => {
        _autoUpdaterCallbacks['update-downloaded'] = callback
    },
    onDownloadProgress: (callback) => {
        _autoUpdaterCallbacks['download-progress'] = callback
    },
    onError: (callback) => {
        _autoUpdaterCallbacks['error'] = callback
    },
    disableDefaults: () => {
        _autoUpdaterAutomatic = false
    }
}

// Params reminder...
// update-available/update-not-available/update-downloaded params = { files, path, releaseDate, sha2, sha512, version }
// download-progress params = { bytesPerSecond, delta, percent, total, transferred }
// error = error = "", params = { cause, code, errno, isOperational}
ipcRenderer.on('auto-updater-event', function(sender, event) {
    if(event.type == 'update-available') {
        if(event.params) {
            window.electronAPIs.autoUpdater.nextVersion = event.params.version 
        }
        if(_autoUpdaterAutomatic) {
            window.electronAPIs.autoUpdater.requestDownload()
        }
    }

    if(event.type == 'update-downloaded') {
        if(_autoUpdaterAutomatic) {
            // if(confirm('Software update downloaded. Restart and apply update now?')) {
            //     window.electronAPIs.autoUpdater.requestUpdate()
            // }
            window.electronAPIs.autoUpdater.requestUpdate()
        }
    }

    if(event.type == 'error') {
        console.error('auto-updater-event of type error received:' , event)
    }


    if(_autoUpdaterCallbacks[event.type]) {
        _autoUpdaterCallbacks[event.type](event)
    }
})




// Browser window.
window.electronAPIs.browserWindow = {
    resize: (width, height, animateMac) => {
        remote.getCurrentWindow().setSize(width,height, animateMac)
    },

    setResizable: (boolean) => {
        remote.getCurrentWindow().setResizable(boolean)
    },

    setMovable: (boolean) => {
        remote.getCurrentWindow().setMovable(boolean)
    },

    setMinimizable: (boolean) => {
        remote.getCurrentWindow().setMinimizable(boolean)
    },

    setMaximizable: (boolean) => {
        remote.getCurrentWindow().setMaximizable(boolean)
    },

    setFullScreenable: (boolean) => {
        remote.getCurrentWindow().setFullScreenable(boolean)
    },

    setFullScreen: (boolean) => {
        remote.getCurrentWindow().setFullScreen(boolean)
    },

    setAlwaysOnTop: (boolean) => {
        remote.getCurrentWindow().setAlwaysOnTop(boolean)
    },

    center: () => {
        remote.getCurrentWindow().center()
    },

    setPosition: (x, y, animateMac) => {
        remote.getCurrentWindow().setPosition(x,y,animateMac)
    },

    setKiosk: (boolean) => {
        remote.getCurrentWindow().setKiosk(boolean)
    },

    setSkipTaskbar: (boolean) => {
        remote.getCurrentWindow().setSkipTaskbar(boolean)
    },

    // has rect optional param..
    capturePage: (callback) => {
        remote.getCurrentWindow().capturePage(callback)
    }
}


// File writing / reading...
// Establish with both NODE in electron, and indexedDB on browser? 

// Priority: Data folder that remains on electron software update?
// Nice: Abstract it as well as possible.
// Neat: Have it work both on electron or browser contexts by using indexedDB as backup.

// window.electronAPIs.writeFile = (fileName, contents, callback) => {
//     // Use Node to write to file.
//     // window.document.body.innerHTML = (remote.app.getPath('userData'))
//     fs.writeFile(path.resolve(remote.app.getPath('userData'), fileName), contents, callback)
// } 

// window.electronAPIs.readFile = (fileName, callback) => {
//     // Use Node to write to file.
//     fs.readFile(path.resolve(remote.app.getPath('userData'), fileName), null, callback)
// } 