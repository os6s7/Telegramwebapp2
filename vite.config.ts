import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import checker from 'vite-plugin-checker'

export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  publicDir: path.resolve(__dirname, 'client/public'),
  base: './',

  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['babel-plugin-styled-components', {
            displayName: true,
            fileName: false
          }]
        ]
      }
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '~': path.resolve(__dirname, 'client')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1600,
    
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  css: {
    postcss: {
      config: path.resolve(__dirname, 'postcss.config.js')
    },
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    fs: {
      strict: true,
      allow: [path.resolve(__dirname)]
    }
  },

  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline'"
    }
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    '__TELEGRAM_WEBAPP__': JSON.stringify(true)
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@twa-dev/sdk',
      'wouter'
    ],
    exclude: ['js-big-decimal']
  }
})