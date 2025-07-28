import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 1. تعريف أنواع TypeScript لـ Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        colorScheme: 'light' | 'dark';
        backgroundColor?: string;
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        initData?: string;
        initDataUnsafe?: any;
        onEvent: (event: string, callback: () => void) => void;
        offEvent: (event: string, callback: () => void) => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}

// 2. تهيئة السمة مع دعم كامل لـ Telegram
const initTelegramApp = () => {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) return;

  const tg = window.Telegram.WebApp;

  // تهيئة الواجهة الأساسية
  tg.expand();
  tg.ready();

  // تطبيق السمة الديناميكية
  const applyTheme = () => {
    document.documentElement.style.setProperty(
      '--tg-bg-color',
      tg.themeParams?.bg_color || '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--tg-text-color',
      tg.themeParams?.text_color || '#000000'
    );
    document.documentElement.classList.toggle('dark', tg.colorScheme === 'dark');
  };

  // تهيئة الزر الرئيسي
  tg.MainButton.setText('إبدأ');
  tg.MainButton.show();
  tg.MainButton.onClick(() => {
    console.log('Main button clicked');
  });

  // تطبيق السمة أولياً
  applyTheme();

  // الاستماع لتغييرات السمة
  tg.onEvent('themeChanged', applyTheme);

  return () => {
    tg.offEvent('themeChanged', applyTheme);
    tg.MainButton.hide();
  };
};

// 3. تهيئة تطبيق React مع Strict Mode وError Boundary
const initReactApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Element with id "root" not found');
    return;
  }

  const root = createRoot(rootElement);

  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red;">
        <h2>حدث خطأ في تحميل التطبيق</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }

  return () => root.unmount();
};

// 4. تهيئة كاملة للتطبيق
const initializeApp = () => {
  const cleanupTelegram = initTelegramApp();
  const cleanupReact = initReactApp();

  return () => {
    cleanupTelegram?.();
    cleanupReact?.();
  };
};

// 5. بدء التطبيق مع حالات التحميل المختلفة
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeApp();
} else {
  document.addEventListener('DOMContentLoaded', initializeApp);
}

// 6. دعم Hot Module Replacement (HMR) أثناء التطوير
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    initializeApp()();
  });
}