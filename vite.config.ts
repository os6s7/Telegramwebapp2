import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { terser } from 'terser'; // استيراد terser مباشرة

export default defineConfig({
  root: path.resolve(__dirname, './client'),
  publicDir: path.resolve(__dirname, './client/public'),

  plugins: [
    react({
      jsxRuntime: 'automatic'
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
    minify: 'terser', // تمكين minification مع terser
    
    terserOptions: { // إضافة خيارات terser
      compress: {
        drop_console: true, // إزالة console.log في الإنتاج
        pure_funcs: ['console.info', 'console.debug'] // إزالة أنواع أخرى من console
      },
      format: {
        comments: false // إزالة التعليقات
      }
    },

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
      '@twa-dev/sdk'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});