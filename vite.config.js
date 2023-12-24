import {defineConfig, loadEnv} from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import vue from '@vitejs/plugin-vue'

export default defineConfig(
{
    plugins: [
        RubyPlugin(),
        vue()
    ]
},
({command, mode}) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd())
    return {
        // vite config
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
    }
})
