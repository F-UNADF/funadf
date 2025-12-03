import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [
    RubyPlugin(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app/frontend'), // racine du code front
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3036,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3036,
    },
  },
});
