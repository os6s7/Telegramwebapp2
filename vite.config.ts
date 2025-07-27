import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js')
    }
  },
  build: {
    commonjsOptions: {
      include: [/@twa-dev\/sdk/, /node_modules/]
    }
  }
})