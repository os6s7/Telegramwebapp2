import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingCart, Star, Shield } from "lucide-react";
import { usLocation } from "wouter";
import { WebApp } from '@twa-dev/sdk';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = usLocatin();

  // تهيئة WebApp عند تحميل المكون
  useEffect(() => {
    if (typeof WebApp !== 'undefined') {
      WebApp.ready();
      WebApp.expand(); // توسيع الويب آب لملء الشاشة
    }
  }, []);

  const handleStartShopping = () => {
    if (typeof WebApp === 'undefined') {
      console.error('WebApp is not available');
      return;
    }

    if (WebApp.initDataUnsafe?.user) {
      navigate("/home");
    } else {
      WebApp.showAlert(
        "يجب التسجيل عبر تطبيق Telegram",
        () => {
          WebApp.openTelegramLink("https://t.me/YourBotUsername");
        }
      );
    }
  };

  // ألوان مخصصة متوافقة مع Telegram
  const colors = {
    bgGradient: 'bg-gradient-to-br from-[#2481cc] to-[#2a9dd6]',
    button: 'bg-white text-[#2481cc] hover:bg-gray-100',
    card: 'bg-white/10 border-white/20',
    textPrimary: 'text-white',
    textSecondary: 'text-blue-100',
    icon: {
      primary: 'text-[#2481cc]',
      warning: 'text-[#ffb800]',
      success: 'text-[#31b545]'
    }
  };

  return (
    <div className={`min-h-screen ${colors.bgGradient} ${colors.textPrimary}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className={`w-8 h-8 ${colors.icon.primary}`} />
          </div>
          <h1 className="text-4xl font-bold mb-4">TeleMarket</h1>
          <p className={`text-xl ${colors.textSecondary} mb-8`}>
            السوق الشامل للسلع المادية على Telegram
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: <ShoppingCart className="w-8 h-8 mb-4" />,
              title: "تسوق سهل",
              description: "تصفح واشتري المنتجات مباشرة على Telegram بتجربة سلسة",
              iconColor: colors.icon.warning
            },
            {
              icon: <Star className="w-8 h-8 mb-4" />,
              title: "دفع متعدد الخيارات",
              description: "ادفع باستخدام Bitcoin أو Ethereum أو عملات Telegram Stars",
              iconColor: colors.icon.warning
            },
            {
              icon: <Store className="w-8 h-8 mb-4" />,
              title: "بيع منتجاتك",
              description: "أنشر منتجاتك وبيعها لملايين مستخدمي Telegram",
              iconColor: colors.icon.success
            },
            {
              icon: <Shield className="w-8 h-8 mb-4" />,
              title: "معاملات آمنة",
              description: "جميع العمليات مؤمنة بتقنية التشفير من Telegram وتقنية البلوكشين",
              iconColor: colors.icon.success
            }
          ].map((feature, index) => (
            <Card key={index} className={`${colors.card} ${colors.textPrimary}`}>
              <CardContent className="p-6">
                <div className={feature.iconColor}>{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className={colors.textSecondary}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartShopping}
            size="lg"
            className={`${colors.button} font-semibold px-8 py-3 text-lg`}
          >
            ابدأ التسوق
          </Button>
          <p className={`text-sm ${colors.textSecondary} mt-4`}>
            سجل الدخول بحساب Telegram لتبدأ
          </p>
        </div>
      </div>
    </div>
  );
}