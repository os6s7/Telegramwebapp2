import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 1. الحصول على عنصر الجذر
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// 2. تفعيل الوضع المظلم قبل render التطبيق
if (typeof window !== "undefined" && window.Telegram?.WebApp?.colorScheme === "dark") {
  document.documentElement.classList.add("dark");
}

// 3. تصيير التطبيق
createRoot(rootElement).render(<App />);