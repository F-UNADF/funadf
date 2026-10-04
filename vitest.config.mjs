// Tests unitaires du front (Vitest + Vue Test Utils) : npm test
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./app/frontend', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['test/javascript/**/*.spec.js'],
    setupFiles: ['test/javascript/setup.js'],
    css: false,
    server: { deps: { inline: ['vuetify'] } },
  },
})
