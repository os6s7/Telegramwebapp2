import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, './client'),
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: ['babel-plugin-macros']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './client/src/shared'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['@twa-dev/sdk']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@twa-dev/sdk'
    ],
    exclude: ['js-big-decimal']
  }
})