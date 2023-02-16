import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({
      minify: true,
      entry: '/src/main.ts',
      template: '/public/index.html',
    }),
  ],
})
