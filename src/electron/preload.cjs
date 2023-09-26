const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('mainAPI', {
    setCookie: (obj) => { ipcRenderer.send('set-cookie', obj) },
    getCookie: () => { return ipcRenderer.invoke('get-cookie') },
    notification: (message) => {
        ipcRenderer.send('notification', message)
    },
    sendIsStarted: (isStarted) => {
        ipcRenderer.send('set-isStarted', isStarted)
    },
    chooseFile: () => {
        return ipcRenderer.invoke('choose-file')
    },
    getDefaultAudios: () => {
        return ipcRenderer.invoke('get-default-audios')
    }
})