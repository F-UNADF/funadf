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
    // npm test -- --coverage : rapport dans coverage-js/ (tout le code front, testé ou non)
    coverage: {
      provider: 'v8',
      include: ['app/frontend/**/*.{js,vue}'],
      exclude: ['app/frontend/entrypoints/**', 'app/frontend/i18n/**'],
      reportsDirectory: 'coverage-js',
      reporter: ['text-summary', 'json-summary', 'html'],
    },
  },
})
