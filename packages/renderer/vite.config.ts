import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pkg from '../../package.json'

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [vue(), vueJsx()],
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',
    chunkSizeWarningLimit: 5000
  },
  server: {
    port: pkg.env.PORT
  }
})
