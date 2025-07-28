import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
          };
        };
        ready: () => void;
        expand: () => void;
        showAlert: (message: string) => void;
        themeParams: {
          bg_color: string;
          text_color: string;
        };
      };
    };
  }
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);
    }

    return () => {
      if (webApp) {
        webApp.close();
      }
    };
  }, []);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user,
    theme: webApp?.themeParams
  };
};
