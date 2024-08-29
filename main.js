const {app, BrowserWindow} = require('electron')
const path = require('path')
const WinState = require('electron-win-state').default
try {
    require('electron-reloader')(module)
} catch {
}


const createWindow = () => {
    const winState = new WinState({
        defaultWidth: 1000,
        defaultHeight: 800,
    })
    const win = new BrowserWindow({
        ...winState.winOptions,
        webPreferences: {
            preload: path.resolve(__dirname, './preload/index.js')
        }
    })

    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
    winState.manage(win)
}

app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})