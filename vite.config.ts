import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer'; // استيراد مباشر بدلاً من require

export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  publicDir: path.resolve(__dirname, 'client/public'),

  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
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
    cssCodeSplit: false,
    assetsInlineLimit: 0,

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      output: {
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'assets/[name].js'
      }
    }
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      overlay: false
    },
    fs: {
      allow: ['..']
    }
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: {
      plugins: [
        autoprefixer() // استخدام الاستيراد المباشر هنا
      ]
    },
    devSourcemap: true
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