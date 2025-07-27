import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingCart, Star, Shield } from "lucide-react";
import { useNavigate } from "wouter";

export default function Landing() {
  const navigate = useNavigate();

  const handleStartShopping = () => {
    if (typeof window.Telegram?.WebApp?.initDataUnsafe?.user !== 'undefined') {
      // مستخدم Telegram مسجل بالفعل
      navigate("/home");
    } else {
      // افتح نافذة Telegram للدخول
      Telegram.WebApp.showAlert("Please sign in through Telegram", () => {
        Telegram.WebApp.openTelegramLink("https://t.me/YourBotUsername");
      });
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
            The ultimate marketplace for physical goods in Telegram
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <ShoppingCart className="w-8 h-8 mb-4 text-tg-warning" />
              <h3 className="text-lg font-semibold mb-2">Easy Shopping</h3>
              <p className="text-blue-100">
                Browse and buy products directly within Telegram with a seamless shopping experience.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <Star className="w-8 h-8 mb-4 text-tg-warning" />
              <h3 className="text-lg font-semibold mb-2">Multiple Payment Options</h3>
              <p className="text-blue-100">
                Pay with Bitcoin, Ethereum, or Telegram Stars for maximum convenience.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <Store className="w-8 h-8 mb-4 text-tg-success" />
              <h3 className="text-lg font-semibold mb-2">Sell Your Products</h3>
              <p className="text-blue-100">
                Create listings and sell your products to millions of Telegram users.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 mb-4 text-tg-success" />
              <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
              <p className="text-blue-100">
                All payments are secured with Telegram's encryption and blockchain technology.
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
            Start Shopping
          </Button>
          <p className="text-sm text-blue-100 mt-4">
            Sign in with your Telegram account to get started
          </p>
        </div>
      </div>
    </div>
  );
}