import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingCart, Star, Shield } from "lucide-react";
import { useNavigate } from "wouter";
import { WebApp } from '@twa-dev/sdk';

export default function Landing() {
  const navigate = useNavigate();

  const handleStartShopping = () => {
    if (WebApp.initDataUnsafe?.user) {
      // User is already authenticated via Telegram
      navigate("/home");
    } else {
      // Request user to open in Telegram app
      WebApp.showAlert(
        "يجب التسجيل عبر تطبيق Telegram",
        () => {
          WebApp.openTelegramLink("https://t.me/YourBotUsername");
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tg-blue to-tg-light text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8 text-tg-blue" />
          </div>
          <h1 className="text-4xl font-bold mb-4">TeleMarket</h1>
          <p className="text-xl text-blue-100 mb-8">
            السوق الشامل للسلع المادية على Telegram
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <ShoppingCart className="w-8 h-8 mb-4 text-tg-warning" />
              <h3 className="text-lg font-semibold mb-2">تسوق سهل</h3>
              <p className="text-blue-100">
                تصفح واشتري المنتجات مباشرة على Telegram بتجربة سلسة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <Star className="w-8 h-8 mb-4 text-tg-warning" />
              <h3 className="text-lg font-semibold mb-2">دفع متعدد الخيارات</h3>
              <p className="text-blue-100">
                ادفع باستخدام Bitcoin أو Ethereum أو عملات Telegram Stars
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <Store className="w-8 h-8 mb-4 text-tg-success" />
              <h3 className="text-lg font-semibold mb-2">بيع منتجاتك</h3>
              <p className="text-blue-100">
                أنشر منتجاتك وبيعها لملايين مستخدمي Telegram
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 mb-4 text-tg-success" />
              <h3 className="text-lg font-semibold mb-2">معاملات آمنة</h3>
              <p className="text-blue-100">
                جميع العمليات مؤمنة بتقنية التشفير من Telegram وتقنية البلوكشين
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={handleStartShopping}
            size="lg"
            className="bg-white text-tg-blue hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
          >
            ابدأ التسوق
          </Button>
          <p className="text-sm text-blue-100 mt-4">
            سجل الدخول بحساب Telegram لتبدأ
          </p>
        </div>
      </div>
    </div>
  );
}