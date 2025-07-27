import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, './client'), // تأكد من صحة المسار
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'), // حدد مسار index.html صراحةً
      external: ['@twa-dev/sdk']
    }
  },
  server: {
    port: 3000,
    strictPort: true
  }
})