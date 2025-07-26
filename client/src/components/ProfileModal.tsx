import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Package, Store, Star, Settings, HelpCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    onClose();
    setLocation(path);
  };

  const handleSellerDashboard = () => {
    onClose();
    setLocation("/seller");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-tg-card overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Profile</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-tg-bg rounded-lg">
              <X className="w-4 h-4 text-tg-text-light" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Profile Info */}
          <div className="text-center">
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=80&h=80&fit=crop&crop=face"} 
              alt="Profile" 
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h4 className="font-bold text-lg text-tg-text">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : "User"
              }
            </h4>
            <p className="text-sm text-tg-text-light">
              {user?.email ? `@${user.email.split('@')[0]}` : "@user"}
            </p>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="text-center">
                <div className="font-bold text-lg text-tg-text">0</div>
                <div className="text-xs text-tg-text-light">Orders</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-tg-text">0</div>
                <div className="text-xs text-tg-text-light">Listings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-tg-text">4.9</div>
                <div className="text-xs text-tg-text-light">Rating</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/orders")}
              className="w-full flex items-center space-x-3 p-3 hover:bg-tg-bg rounded-xl justify-start h-auto"
            >
              <Package className="w-5 h-5 text-tg-text-light" />
              <span className="flex-1 text-left">My Orders</span>
              <ArrowRight className="w-4 h-4 text-tg-text-light" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/seller")}
              className="w-full flex items-center space-x-3 p-3 hover:bg-tg-bg rounded-xl justify-start h-auto"
            >
              <Store className="w-5 h-5 text-tg-text-light" />
              <span className="flex-1 text-left">My Listings</span>
              <ArrowRight className="w-4 h-4 text-tg-text-light" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                // Placeholder for wallet functionality
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-tg-bg rounded-xl justify-start h-auto"
            >
              <Star className="w-5 h-5 text-tg-text-light" />
              <span className="flex-1 text-left">Wallet</span>
              <ArrowRight className="w-4 h-4 text-tg-text-light" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                // Placeholder for settings functionality
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-tg-bg rounded-xl justify-start h-auto"
            >
              <Settings className="w-5 h-5 text-tg-text-light" />
              <span className="flex-1 text-left">Settings</span>
              <ArrowRight className="w-4 h-4 text-tg-text-light" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                // Placeholder for help functionality
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-tg-bg rounded-xl justify-start h-auto"
            >
              <HelpCircle className="w-5 h-5 text-tg-text-light" />
              <span className="flex-1 text-left">Help & Support</span>
              <ArrowRight className="w-4 h-4 text-tg-text-light" />
            </Button>
          </div>

          {/* Seller Dashboard Access */}
          <Card className="bg-gradient-to-r from-tg-blue to-tg-light text-white">
            <CardContent className="p-4">
              <h5 className="font-bold mb-1">Seller Dashboard</h5>
              <p className="text-sm text-blue-100 mb-3">Manage your listings and track sales</p>
              <Button 
                className="bg-white text-tg-blue hover:bg-gray-100 font-medium"
                onClick={handleSellerDashboard}
              >
                Open Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
