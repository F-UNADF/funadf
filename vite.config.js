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
        emptyOutDir: true, // Nettoie avant build
        rollupOptions: {
            input: 'app/frontend/entrypoints.js'
        },
        ssrOutputDir: '../../public/vite/ssr', // ✅ Corrige la sortie SSR pour éviter les fichiers perdus
    },
    server: {
        host: '0.0.0.0',
        port: 3036,
        allowedHosts: true,
        strictPort: true,
    },
    cacheDir: '../../public/vite/.cache', // ✅ Évite la création de .vite/
    base: '/app/frontend/',
});
