import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pkg from '../../package.json'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('custom')
        }
      }
    }),
    vueJsx(),
    chunkSplitPlugin({ strategy: 'single-vendor' })
  ],
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer'
  },
  server: {
    port: pkg.env.PORT
  }
})
