import packageInfo from './package.json';
import path from 'path';
import SvgLoader from 'vite-svg-loader';
import ViteRestart from 'vite-plugin-restart';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default ({ command, mode }) => {
    return defineConfig({
        plugins: [
            vue({}),
            SvgLoader(),

            //this restarts the server if server config or package.json has changed
            ViteRestart({
                restart: ['tsconfig.json', 'vite.user.config.json', 'package.json'],
            }),
        ],
        base: './',

        server: {
            host: true,
            https: false,
            port: 8080, // vite default is 3000, takes the next available if 8080 is taken
        },

        // resolve src folder alias
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // include global scss variable and mixin files
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "./src/scss/_variables.scss"; @import "./src/scss/_mixins.scss";`,
                    quietDeps: true,
                },
            },
        },
    });
};
