import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 1. دالة تهيئة تيليجرام الآمنة
const initTelegramTheme = () => {
  if (typeof window === "undefined") return; // تجنب الأخطاء في SSR
  
  // انتظر حتى يصبح Telegram.WebApp جاهزًا (مهم لبعض الحالات)
  const checkTelegram = () => {
    if (window.Telegram?.WebApp?.initData) {
      // تطبيق الوضع المظلم
      document.documentElement.classList.toggle(
        "dark",
        window.Telegram.WebApp.colorScheme === "dark"
      );
      
      // الاستجابة للتغييرات الديناميكية
      window.Telegram.WebApp.onEvent("themeChanged", () => {
        document.documentElement.classList.toggle(
          "dark",
          window.Telegram.WebApp.colorScheme === "dark"
        );
      });
    } else {
      setTimeout(checkTelegram, 100); // إعادة المحاولة بعد 100ms
    }
  };
  
  checkTelegram();
};

// 2. تهيئة التطبيق بعد تحميل DOM
document.addEventListener("DOMContentLoaded", () => {
  initTelegramTheme();
  
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  
  createRoot(rootElement).render(<App />);
});