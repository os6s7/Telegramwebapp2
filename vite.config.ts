import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      // أضف هذا الـ alias لحل مشكلة telegram-web-app
      "telegram-web-app": "@twa-dev/sdk"
    },
  },
  define: {
    "process.env.TELEGRAM_BOT_TOKEN": JSON.stringify(process.env.TELEGRAM_BOT_TOKEN),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // عدّل هذا الجزء لاستخدام الحزمة الرسمية
          telegram: ["@twa-dev/sdk"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@twa-dev/sdk"]
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});