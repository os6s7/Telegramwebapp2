import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { useState } from "react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [justAdded, setJustAdded] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const handleCardClick = () => {
    setLocation(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  return (
    <div 
      className="bg-tg-card rounded-xl shadow-tg overflow-hidden cursor-pointer hover:shadow-tg-lg transition-shadow"
      onClick={handleCardClick}
    >
      <img 
        src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"} 
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="font-medium text-sm text-tg-text mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-tg-text-light mb-2">
          {product.seller?.firstName && product.seller?.lastName 
            ? `${product.seller.firstName} ${product.seller.lastName}`
            : "Unknown Seller"
          }
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-tg-blue">${product.price}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-tg-warning fill-current" />
            <span className="text-xs text-tg-text-light">
              {product.rating || "0"}
            </span>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || Number(product.stock) === 0}
          className={`w-full py-2 text-sm rounded-lg transition-colors ${
            justAdded 
              ? "bg-tg-success text-white" 
              : "bg-tg-bg text-tg-text hover:bg-gray-200"
          }`}
          variant="secondary"
        >
          {addToCartMutation.isPending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-tg-text mr-1"></div>
              Adding...
            </div>
          ) : justAdded ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Added!
            </>
          ) : Number(product.stock) === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <Plus className="w-3 h-3 mr-1" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
