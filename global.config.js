const __dirname = import.meta.dirname
export const DIRs = {
    MAIN_DIR: __dirname,
    FILE_SAVE_DIR: `${__dirname}/public/file_save`,
    FILE_SAVE_PAIFU_DIR: `${__dirname}/public/file_save/paifu_json`,
}
export const PATHs = {
    PRELOAD_PATH: `${__dirname}/electron/preload/index.js`,
    FILE_SAVE_INFO_PATH: `${__dirname}/public/file_save/info.json`,
}
export const COM_POINT = {
    IP: 'http://localhost',
    VITE_PORT: 3000,
    SERVER_PORT: 3001,
}