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
    cssTarget: 'es2020', // أضف هذا السطر
    assetsInlineLimit: 4096, // أضف هذا السطر

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk'],

      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        },
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: 'assets/[name].[ext]' // أضف هذا السطر
      },

      onwarn(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning);
      }
    }
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true
    },
    fs: { // أضف هذا القسم الجديد
      strict: false,
      allow: ['..']
    }
  },

  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['telegramwebapp2.onrender.com']
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@twa-dev/sdk'
    ],
    exclude: ['js-big-decimal'],
    esbuildOptions: {
      target: 'es2020',
      supported: { // أضف هذا السطر
        'top-level-await': true
      }
    }
  },

  esbuild: {
    target: 'es2020',
    legalComments: 'none' // أضف هذا السطر
  },

  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]' // أضف هذا السطر
    },
    postcss: path.resolve(__dirname, './postcss.config.js'),
    devSourcemap: true // أضف هذا السطر
  }
});