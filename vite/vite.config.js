import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {COM_POINT} from '../global.config.js'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        https: false,
        port: COM_POINT.VITE_PORT
    },
    resolve: {
        alias: {
            '@': '/vite/src'
        }
    }
})
