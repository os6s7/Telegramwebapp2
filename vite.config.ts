import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // حل مشكلة المسارات المطلقة
      '@': path.resolve(__dirname, './client/src'),
      // الحل الخاص لـ @twa-dev/sdk
      '@twa-dev/sdk': path.resolve(__dirname, 'node_modules/@twa-dev/sdk/dist/index.js')
    }
  },
  build: {
    rollupOptions: {
      // الحل السحري لمنع الأخطاء
      external: ['@twa-dev/sdk'],
      output: {
        globals: {
          '@twa-dev/sdk': 'TelegramWebApp'
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/, /@twa-dev\/sdk/]
    }
  },
  optimizeDeps: {
    include: ['@twa-dev/sdk']
  }
})