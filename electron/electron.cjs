const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs")
        }
    });
    if (isDev) {
        win.webContents.openDevTools();
    }
    win.loadFile(path.join(__dirname, '../public/index.html'))
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
    return session.defaultSession.cookies.get({ URL: 'http://localhsot' }).then(cookie => {
        console.log("getCookie is successful");
        return cookie
    }).catch(err => {
        console.log(err)
    })
}

app.whenReady().then(() => {
    createWindow()
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    ipcMain.on('set-cookie', (event, cookie) => {
        setCookie(cookie)
    })
    ipcMain.handle('get-cookie', getCookie)
})
app.on('window-all-closed', () => {
    app.quit()
})