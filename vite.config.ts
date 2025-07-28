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
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    minify: 'terser',

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk', '@shared/schema'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        },
        assetFileNames: 'assets/[name].[hash].[ext]',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },

  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    fs: {
      strict: false,
      allow: ['..']
    }
  },

  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    strictPort: true
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: path.resolve(__dirname, './postcss.config.js'),
    devSourcemap: true
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@twa-dev/sdk'
    ],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true
      }
    }
  }
});