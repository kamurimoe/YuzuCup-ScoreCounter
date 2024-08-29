import {createApp} from 'vue'
import {ElForm,ElText, ElButton, ElInput} from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElForm)
app.use(ElText)
app.use(ElInput)
app.use(ElButton)


app.mount('#app')