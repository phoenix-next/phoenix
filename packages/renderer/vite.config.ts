import { builtinModules } from 'module'
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import resolve from 'vite-plugin-resolve'
import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [vue()],
  base: './',
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    emptyOutDir: true,
    outDir: '../../dist/renderer'
  },
  server: {
    port: pkg.env.PORT
  }
})
