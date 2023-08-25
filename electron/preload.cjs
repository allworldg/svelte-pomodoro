const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('myAPI', {
    test: 'test'
})