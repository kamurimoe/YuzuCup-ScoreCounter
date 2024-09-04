import {createApp} from 'vue'
import {
    ElAside,
    ElButton,
    ElCol,
    ElCollapse,
    ElContainer,
    ElDivider,
    ElForm,
    ElHeader,
    ElInput,
    ElMain,
    ElMessage,
    ElRow,
    ElScrollbar,
    ElSelect,
    ElSwitch,
    ElTable,
    ElTabs,
    ElText,
    ElTooltip,
    ElTree,
    ElTreeSelect,
} from 'element-plus'
import 'element-plus/dist/index.css'
import '@/style.css'
import App from '@/App.vue'

const app = createApp(App)
app.use(ElRow).use(ElCol).use(ElForm).use(ElText)
    .use(ElInput).use(ElTable).use(ElButton).use(ElMessage)
    .use(ElCollapse).use(ElContainer).use(ElHeader).use(ElAside)
    .use(ElMain).use(ElTabs).use(ElScrollbar).use(ElTree)
    .use(ElSelect).use(ElTreeSelect).use(ElTooltip).use(ElDivider).use(ElSwitch)
app.mount('#app')