import {app, BrowserWindow,dialog } from 'electron'
import {PATHs,COM_POINT} from "../global.config.js";
import Win_State from "electron-win-state";
import {runServer} from "../server/server.js"
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
    // win.webContents.openDevTools()
    winState.manage(win)


}
function showErrorDialog(message) {
    dialog.showMessageBox({
        type: 'error',
        title: '错误',
        message: message,
        buttons: ['确定'],
    });
}
app.whenReady().then(() => {
    try {
        runServer();
        createWindow()
    } catch (error) {
        showErrorDialog(error.message);
    }
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})