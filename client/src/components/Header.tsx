import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Search, ShoppingCart, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ searchQuery, onSearchChange, onCartClick, onProfileClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    retry: false,
  });

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <>
      <header className="bg-tg-card shadow-tg sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-tg-blue rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-lg text-tg-text">TeleMarket</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2"
            >
              <Search className="w-4 h-4 text-tg-text-light" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="p-2 relative"
            >
              <ShoppingCart className="w-4 h-4 text-tg-text-light" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-tg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="w-8 h-8 rounded-full overflow-hidden p-0"
            >
              <User className="w-4 h-4 text-tg-text-light" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 pb-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tg-text-light" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-tg-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-blue"
                />
              </div>
              <Button 
                variant="ghost"
                onClick={() => setIsSearchOpen(false)}
                className="text-tg-blue font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
