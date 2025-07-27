import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// دالة لتهيئة سمة تيليجرام
const initTelegramTheme = () => {
  if (typeof window === "undefined") return;

  const setupTheme = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    // تطبيق السمة الحالية
    document.documentElement.classList.toggle("dark", tg.colorScheme === "dark");

    // الاستجابة لتغييرات السمة
    tg.onEvent("themeChanged", () => {
      document.documentElement.classList.toggle("dark", tg.colorScheme === "dark");
    });
  };

  // إذا كان WebApp جاهزاً
  if (window.Telegram?.WebApp?.initData) {
    setupTheme();
  } else {
    // الانتظار حتى يصبح جاهزاً (لحالات التحميل البطيء)
    const observer = new MutationObserver(() => {
      if (window.Telegram?.WebApp?.initData) {
        setupTheme();
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: false,
      subtree: false,
      attributes: true,
    });
  }
};

// تهيئة التطبيق بعد تحميل DOM
document.addEventListener("DOMContentLoaded", () => {
  initTelegramTheme();
  
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  
  createRoot(rootElement).render(<App />);
});