import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 1. تعريف نوع TypeScript لـ Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        colorScheme: 'light' | 'dark';
        initData?: string;
        onEvent: (event: string, callback: () => void) => void;
        offEvent: (event: string, callback: () => void) => void;
      };
    };
  }
}

// 2. دالة لتهيئة السمة مع تحسينات الأداء
const initTelegramTheme = () => {
  if (typeof window === 'undefined') return;

  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', tg.colorScheme === 'dark');
  };

  // تطبيق السمة فوراً
  applyTheme();

  // إضافة Listener لتغييرات السمة
  tg.onEvent('themeChanged', applyTheme);

  // تنظيف عند التدمير
  return () => {
    tg.offEvent('themeChanged', applyTheme);
  };
};

// 3. تهيئة التطبيق مع Strict Mode
const initApp = () => {
  const cleanupTheme = initTelegramTheme();
  
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');

  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // تنظيف عند التدمير (لـ HMR في التطوير)
  return () => {
    cleanupTheme?.();
    root.unmount();
  };
};

// 4. تهيئة التطبيق مع حالات التحميل المختلفة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}