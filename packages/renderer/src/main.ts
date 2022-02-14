import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import naive from 'naive-ui'

createApp(App)
  .use(router)
  .use(naive)
  .mount('#app')
  .$nextTick(window.removeLoading)

// console.log('fs', window.fs)
// console.log('ipcRenderer', window.ipcRenderer)

// Usage of ipcRenderer.on
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})
