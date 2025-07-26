import { Button } from "@/components/ui/button";
import { Home, Search, Package, Store, User } from "lucide-react";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/orders", icon: Package, label: "Orders" },
    { path: "/seller", icon: Store, label: "Sell" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-tg-card border-t border-gray-100 z-50 max-w-md mx-auto">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Button
              key={path}
              variant="ghost"
              onClick={() => setLocation(path)}
              className={`flex flex-col items-center space-y-1 py-2 px-4 ${
                isActive ? "text-tg-blue" : "text-tg-text-light"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
