const { contextBridge } = require('electron')
// import {contextBridge} from 'electron' //暂不支持ESM
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
    // 除函数之外，我们也可以暴露变量
})
