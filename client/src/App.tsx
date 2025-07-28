import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import SellerDashboard from "@/pages/seller-dashboard";
import Orders from "@/pages/orders";
import Profile from "@/pages/profile";
import { useEffect, useMemo } from "react";
import { queryClient } from "./lib/queryClient";
import { useTelegram } from "@/hooks/useTelegram";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { webApp } = useTelegram();

  const routes = useMemo(() => {
    if (isLoading) return <Route path="/" component={Landing} />;
    
    if (!isAuthenticated) {
      webApp?.MainButton.hide();
      return <Route path="/" component={Landing} />;
    }

    webApp?.MainButton.setText('الرئيسية').show();
    return (
      <>
        <Route path="/" component={Home} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/seller" component={SellerDashboard} />
        <Route path="/orders" component={Orders} />
        <Route path="/profile" component={Profile} />
      </>
    );
  }, [isAuthenticated, isLoading, webApp]);

  return (
    <Switch>
      {routes}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { webApp, themeParams } = useTelegram();

  // تطبيق سمة Telegram الديناميكية
  useEffect(() => {
    if (!webApp || !themeParams) return;

    const applyTheme = () => {
      document.documentElement.style.setProperty(
        '--tg-bg-color', 
        themeParams.bg_color || '#ffffff'
      );
      document.documentElement.style.setProperty(
        '--tg-text-color',
        themeParams.text_color || '#000000'
      );
      document.body.className = webApp.colorScheme === 'dark' 
        ? 'bg-tg-bg-dark' 
        : 'bg-tg-bg';
    };

    applyTheme();
    
    const handleThemeChange = () => {
      applyTheme();
      webApp?.setHeaderColor(themeParams.bg_color);
      webApp?.setBackgroundColor(themeParams.bg_color);
    };

    webApp.onEvent('themeChanged', handleThemeChange);
    return () => webApp.offEvent('themeChanged', handleThemeChange);
  }, [webApp, themeParams]);

  // تهيئة Telegram WebApp
  useEffect(() => {
    if (!webApp) return;

    webApp.expand();
    webApp.enableClosingConfirmation();
    webApp.ready();

    return () => {
      webApp.MainButton.hide();
      webApp.disableClosingConfirmation();
    };
  }, [webApp]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <div 
          className="font-inter text-tg-text max-w-md mx-auto relative overflow-x-hidden min-h-screen transition-colors duration-200"
          style={{
            backgroundColor: 'var(--tg-bg-color)',
            color: 'var(--tg-text-color)'
          }}
        >
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;