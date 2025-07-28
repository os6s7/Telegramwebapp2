import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname, 'client'),
  publicDir: path.resolve(__dirname, 'client/public'),
  base: '/',

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
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'client/src/shared'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/web.js')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'terser' : false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production'
      }
    }
  },

  css: {
    postcss: {
      plugins: [autoprefixer()]
    },
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },

  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },

  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    strictPort: true
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    __APP_ENV__: JSON.stringify(mode)
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@twa-dev/sdk',
      '@tanstack/react-query'
    ]
  }
}));