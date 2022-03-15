import { createApp } from 'vue'
import Provider from './Provider.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

createApp(Provider)
  .use(router)
  .use(createPinia())
  .use(mavonEditor)
  .mount('#app')
