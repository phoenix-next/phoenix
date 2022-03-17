import { createApp } from 'vue'
import Provider from './Provider.vue'
import router from './router/index'
import { createPinia } from 'pinia'

createApp(Provider).use(router).use(createPinia()).mount('#app')
