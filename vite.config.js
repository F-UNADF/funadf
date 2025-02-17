import {defineConfig} from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        RubyPlugin(),
        vue(),
    ],
    server: {
        host: '0.0.0.0',  // Écoute sur toutes les interfaces réseau
        port: 3036,       // Correspond au port défini dans ton `docker-compose.yml`
        allowedHosts: true,
        strictPort: true,
    },
});