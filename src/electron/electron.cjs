const { app, BrowserWindow, ipcMain, session, Notification, Tray, Menu } = require('electron')
const path = require('path')
const isDev = !app.isPackaged
let tray;
let win
let isStarted = 1;
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
        console.log("is dev")
    } else {
        win.loadFile(path.join(__dirname, '../index.html'))
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

app.whenReady().then(() => {
    createWindow()
    getCookie().then(cookie => {
        if (cookie.length == 0) {
            setCookie({ 'tomatoes': '1', 'rests': '0', 'cycles': '1', 'audio_paths': [], 'audio_path': {} })
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
    ipcMain.handle('get-cookie', getCookie)
    ipcMain.on('set-isStarted', (e, message) => {
        isStarted = message;
    })
})
app.on('window-all-closed', () => {
    app.quit()
})