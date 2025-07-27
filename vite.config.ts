import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// 🔻 هذا السطر إحذفه
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // 🔻 هذا السطر إحذفه
    // process.env.ANALYZE === "true" ? visualizer() : null,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  define: {
    "process.env.TELEGRAM_BOT_TOKEN": JSON.stringify(process.env.TELEGRAM_BOT_TOKEN),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          telegram: ["telegram-web-app"],
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});