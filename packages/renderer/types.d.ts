/// <reference types="vite/client" />

import vue from 'vue'
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

import { MessageApi } from 'naive-ui'
declare global {
  interface Window {
    // Expose some Api through preload script
    utilsBridge: typeof import('../preload/utils').default
    $message: MessageApi
    MonacoEnvironment: any
  }
}
