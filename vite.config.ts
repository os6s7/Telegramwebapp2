import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, './client'),
  plugins: [
    react({
      // إزالة babel-plugin-macros إذا لم تكن بحاجة إليه
      // أو الاحتفاظ به بعد تثبيت الحزمة
      babel: {
        plugins: [] // يمكنك إضافة plugins أخرى هنا إذا لزم الأمر
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './client/src/shared'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk']
    }
  },
  server: {
    port: 3000,
    strictPort: true
  }
})