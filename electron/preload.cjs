const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('mainAPI', {
    setCookie: (obj) => { ipcRenderer.send('set-cookie', obj) },
    getCookie: () => { return ipcRenderer.invoke('get-cookie') }
})