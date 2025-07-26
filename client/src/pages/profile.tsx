import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Package, Store, Star, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleBack = () => {
    setLocation("/");
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-blue mx-auto mb-4"></div>
          <p className="text-tg-text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tg-bg pb-20">
      {/* Header */}
      <div className="bg-tg-card shadow-tg sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-lg text-tg-text">Profile</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <Card>
          <CardContent className="p-6 text-center">
            <img
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h2 className="font-bold text-lg text-tg-text">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : "User"
              }
            </h2>
            <p className="text-sm text-tg-text-light">{user?.email}</p>
            
            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="font-bold text-lg text-tg-text">0</div>
                <div className="text-xs text-tg-text-light">Orders</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-tg-text">0</div>
                <div className="text-xs text-tg-text-light">Listings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-tg-text">5.0</div>
                <div className="text-xs text-tg-text-light">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => handleNavigation("/orders")}
          >
            <Package className="w-5 h-5 mr-3 text-tg-text-light" />
            <span className="flex-1 text-left">My Orders</span>
            <ArrowLeft className="w-4 h-4 text-tg-text-light rotate-180" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => handleNavigation("/seller")}
          >
            <Store className="w-5 h-5 mr-3 text-tg-text-light" />
            <span className="flex-1 text-left">My Listings</span>
            <ArrowLeft className="w-4 h-4 text-tg-text-light rotate-180" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => toast({ title: "Coming Soon", description: "Wallet feature is coming soon!" })}
          >
            <Star className="w-5 h-5 mr-3 text-tg-text-light" />
            <span className="flex-1 text-left">Wallet</span>
            <ArrowLeft className="w-4 h-4 text-tg-text-light rotate-180" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => toast({ title: "Coming Soon", description: "Settings feature is coming soon!" })}
          >
            <Settings className="w-5 h-5 mr-3 text-tg-text-light" />
            <span className="flex-1 text-left">Settings</span>
            <ArrowLeft className="w-4 h-4 text-tg-text-light rotate-180" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => toast({ title: "Coming Soon", description: "Help & Support feature is coming soon!" })}
          >
            <HelpCircle className="w-5 h-5 mr-3 text-tg-text-light" />
            <span className="flex-1 text-left">Help & Support</span>
            <ArrowLeft className="w-4 h-4 text-tg-text-light rotate-180" />
          </Button>
        </div>

        {/* Seller Dashboard Promotion */}
        <Card className="bg-gradient-to-r from-tg-blue to-tg-light text-white">
          <CardContent className="p-4">
            <h3 className="font-bold mb-1">Seller Dashboard</h3>
            <p className="text-sm text-blue-100 mb-3">Manage your listings and track sales</p>
            <Button 
              className="bg-white text-tg-blue hover:bg-gray-100 font-medium"
              onClick={() => handleNavigation("/seller")}
            >
              Open Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full text-tg-error border-tg-error hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
