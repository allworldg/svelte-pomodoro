const { app, BrowserWindow, ipcMain, session, Notification, Tray, Menu, dialog } = require('electron')
const path = require('path')
const isDev = !app.isPackaged
const DEFAULT_AUDIO_PATH = path.join(__dirname, "../../public/resource/forest.mp4")
const DEFAULT_AUDIO_NAME = "forest"
let tray;
let win
let isStarted = 1;
let defaultAudios = [
    { name: "无", path: "" },
    { name: DEFAULT_AUDIO_NAME, path: DEFAULT_AUDIO_PATH }
]
app.disableHardwareAcceleration()




const createWindow = () => {
    win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
        },
        icon: path.join(__dirname, "../../public/resource/tomato.png")
    });
    if (isDev) {
        win.webContents.openDevTools();
        win.loadURL('http://localhost:5173/')
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
    win.on('close', (event) => {
        if (isStarted == 0) {
            event.preventDefault();
            win.hide();
        }
    })

    tray = new Tray(path.join(__dirname, "../../public/resource/tomato.png"));
    // tray = new Tray("../public/Tomato.svg"));
    tray.setToolTip("tomato")
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        win.show();
    });
}

function setCookie(obj) {

    session.defaultSession.cookies.set({
        url: 'http://localhost',
        name: 'myTime',
        value: JSON.stringify(obj),
        expirationDate: 2222222222,
    }).then(() => {
        console.log("setCookie is successful")
    }).catch(err => {
        console.log("err" + err)
    })

}
function getCookie() {
    return session.defaultSession.cookies.get({ URL: 'http://localhost' }).then(cookie => {
        console.log("getCookie is successful");
        return cookie
    }).catch(err => {
        console.log(err)
    })
}
function init() {
    setCookie({
        tomatoes: '1',
        rests: '0',
        cycles: '1',
        audios: defaultAudios,
        cur_audio: { name: "无", path: "" },
    })
}

const additionalData = { myKey: 'myValue' }
const gotTheLock = app.requestSingleInstanceLock(additionalData)

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            // if (win.isMinimized()) win.restore()
            win.show();
            win.focus()
        }
    })

    app.whenReady().then(() => {
        createWindow()
        getCookie().then(cookie => {
            if (cookie.length == 0) {
                init();
            }
        })
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
        ipcMain.on('set-cookie', (event, cookie) => {
            setCookie(cookie)
        })
        ipcMain.on('notification', (e, message) => {
            new Notification({ title: "no title", body: message }).show()
        })
        ipcMain.handle('get-cookie', async () => {
            let cookie = await getCookie()
            if (cookie.length == 0) {
                init();
            }
            cookie = await getCookie();
            return cookie;
        })
        ipcMain.on('set-isStarted', (e, message) => {
            isStarted = message;
        })
        ipcMain.handle('choose-file', async () => {
            let file = await dialog.showOpenDialog()
            if (!file.canceled) {
                let obj = { name: path.basename(file.filePaths[0]), path: file.filePaths[0] }
                return obj;
            }
        })
        ipcMain.handle('get-default-audios', async () => {
            return defaultAudios;
        }
        )
        app.on('window-all-closed', () => {
            app.quit()
        })
    })
}