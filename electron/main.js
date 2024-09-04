import {app, BrowserWindow} from 'electron'
import {PATHs,COM_POINT} from "../global.config.js";
import Win_State from "electron-win-state";
const WinState = Win_State.default
const createWindow = () => {
    const winState = new WinState({
        defaultWidth: 1000,
        defaultHeight: 800,
    })
    const win = new BrowserWindow({
        ...winState.winOptions,
        webPreferences: {
            preload: PATHs.PRELOAD_PATH
        }
    })

    win.loadURL(`${COM_POINT.IP}:${COM_POINT.VITE_PORT}`)
    win.webContents.openDevTools()
    winState.manage(win)
}

app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})