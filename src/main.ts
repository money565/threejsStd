import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import '@/assets/styles/index.scss'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia)
app.use(router)

app.mount('#app')
