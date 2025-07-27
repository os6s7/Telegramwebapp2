import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, './client'),
  publicDir: path.resolve(__dirname, './client/public'),

  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: []
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './client/src/shared'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false, // أهم تعديل - يمنع تقسيم ملفات CSS
    assetsInlineLimit: 0, // يعطّل تضمين الموارد كـ base64

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        },
        assetFileNames: 'assets/[name].[ext]' // تنسيق أبسط لأسماء الملفات
      }
    }
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: false // يعطّل overlay HMR لتجنب التشويش
    }
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: path.resolve(__dirname, './postcss.config.js'),
    devSourcemap: true // تمكين sourcemaps للـ CSS
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@twa-dev/sdk'
    ]
  }
});