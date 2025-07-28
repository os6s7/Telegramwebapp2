import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname, 'client'),
  publicDir: path.resolve(__dirname, 'client/public'),
  base: mode === 'production' ? '/' : '/',

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
    visualizer({
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ],

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'client/src') },
      { find: '@shared', replacement: path.resolve(__dirname, 'client/src/shared') },
      { find: 'react', replacement: path.resolve(__dirname, './node_modules/react') },
      { find: 'react-dom', replacement: path.resolve(__dirname, './node_modules/react-dom') },
      { 
        find: '@twa-dev/sdk', 
        replacement: mode === 'production' 
          ? path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/web.js') 
          : path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/web-debug.js')
      }
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.mjs']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'terser' : false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1500,
    
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
        sw: path.resolve(__dirname, 'client/src/sw.js')
      },
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
      plugins: [
        autoprefixer(),
        mode === 'production' && require('cssnano')({
          preset: 'advanced'
        })
      ].filter(Boolean)
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
    },
    proxy: {
      '/api': {
        target: 'https://api.telegram.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    strictPort: true,
    headers: {
      'Content-Security-Policy': "default-src 'self' https://telegram.org; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline'"
    }
  },

  define: {
    'process.env.TELEGRAM_WEBAPP_VERSION': JSON.stringify(process.env.npm_package_version),
    'process.env.NODE_ENV': JSON.stringify(mode),
    __APP_ENV__: JSON.stringify(mode)
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@twa-dev/sdk',
      '@tanstack/react-query'
    ],
    exclude: [
      'js-big-decimal'
    ]
  }
}));