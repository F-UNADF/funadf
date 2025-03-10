import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        RubyPlugin(),
        vue(),
    ],
    build: {
        manifest: true,
        outDir: 'public/vite',
        emptyOutDir: true, // Efface le dossier avant chaque build
        rollupOptions: {
            input: 'app/frontend/entrypoints.js'
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3036,
        allowedHosts: true,
        strictPort: true,
    },
    cacheDir: 'public/vite/.cache', // Déplace le cache de Vite pour éviter .vite/
    base: '/app/frontend/',
});
