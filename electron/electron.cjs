const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
console.log(process.env.NODE_ENV)
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
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    app.quit()
})