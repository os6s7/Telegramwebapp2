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
        plugins: [] // ممكن تضيف بلجنات هنا
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './client/src/shared'), // ✅ لحل خطأ import
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

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk'],

      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['@twa-dev/sdk']
        },
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
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
    }
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
      target: 'es2020'
    }
  },

    esbuild: {
    target: 'es2020'
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: path.resolve(__dirname, './postcss.config.js')
  }
});