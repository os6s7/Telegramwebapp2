import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'client'), // التأكيد على استخدام مجلد client كجذر
  publicDir: path.resolve(__dirname, 'client/public'), // مسار الملفات العامة

  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['babel-plugin-import', {
            libraryName: '@twa-dev/sdk',
            camel2DashComponentName: false
          }]
        ]
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'), // تحديث المسارات النسبية
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false, // تعطيل تقسيم CSS
    assetsInlineLimit: 0, // منع تضمين الموارد كـ base64

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'), // المسار المطلق لملف HTML
      output: {
        assetFileNames: 'assets/[name].[ext]', // تنسيق ملفات الأصول
        entryFileNames: 'assets/[name].js' // تنسيق ملفات الدخول
      }
    }
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'ws', // استخدام WebSocket لـ HMR
      overlay: false // تعطيل overlay للرسائل
    },
    fs: {
      allow: ['..'] // السماح بالوصول لمجلدات أعلى
    }
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: {
      plugins: [
        require('autoprefixer')()
      ]
    },
    devSourcemap: true // تمكين source maps للتصحيح
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@twa-dev/sdk'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});