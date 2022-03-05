import { createApp } from 'vue'
import Provider from './Provider.vue'
import router from './router/index'
import naive from 'naive-ui'
import { createPinia } from 'pinia'

createApp(Provider).use(router).use(naive).use(createPinia()).mount('#app')
