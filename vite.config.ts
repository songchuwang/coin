import { resolve } from 'path';
import {defineConfig, loadEnv, UserConfig} from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'
import {Plugin} from "postcss";

// https://vitejs.dev/config/
export default defineConfig((config): UserConfig => {
  const isBuild = process.env.NODE_ENV === 'production';
  const localEnv = loadEnv(config.mode, process.cwd(), 'VITE_');
  return {
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['defaults'],
            grid: true,
          }),
          postcsspxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 750, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            landscape: false, // 是否处理横屏情况
          }) as Plugin,
        ]
      }
    },
    resolve: {
      alias: {
        // 设置别名
        '@': resolve(__dirname, './src'),
        // '/^(@?src\/.*)\.js$/': '$1.ts'
      },
    },
    server: {
      port: 3006,
      host: true,
      open: true,
      proxy: {
        '/app-api': {
          target: 'http://107.148.47.105:48080',
          changeOrigin:true
        },
        '/admin-api': {
          target: 'http://107.148.47.105:48080',
          changeOrigin:true
        },
      }
      // proxy: createProxy(localEnv.VITE_APP_BASE_API, localEnv.VITE_APP_URL),
    },
    plugins: [
      react(),
      nodePolyfills(),
    ],
    build: {
      chunkSizeWarningLimit: 500,
      sourcemap: false,
      minify: 'terser', // esbuild
      // target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
      cssCodeSplit: true,
      cssTarget: 'chrome61',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        output: {
          sourcemap: true,
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // plugins: createRollupPlugins(),
        treeshake: true,
      }
    },
    define: {
      __ISBUILDPRODUCTION__: isBuild,
      // ROUTES: new TransformPages().routes
    },
  }
})
