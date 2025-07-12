import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        RubyPlugin(),
        vue(),
    ],
    server: {
        host: '0.0.0.0',
        port: 3036,
        strictPort: true,
        cors: true,
        watch: {
            usePolling: true,       // active le polling
            interval: 1000          // optionnel, en ms
        },
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 3036
        }
    },
    base: '/app/frontend/',
});
