import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, ShoppingCart, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["/api/products", params?.id],
    enabled: !!params?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added to cart!",
      });
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

  const handleBack = () => {
    window.history.back();
  };

  const handleAddToCart = () => {
    if (params?.id) {
      addToCartMutation.mutate(params.id);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-tg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-blue mx-auto mb-4"></div>
          <p className="text-tg-text-light">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-tg-bg flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-tg-text-light mb-4">Product not found</p>
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
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
          <h1 className="font-bold text-lg text-tg-text">Product Details</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Product Image */}
      <div className="bg-tg-card">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"} 
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="font-bold text-xl text-tg-text mb-2">{product.name}</h2>
                <div className="flex items-center space-x-2 mb-2">
                  <Store className="w-4 h-4 text-tg-text-light" />
                  <span className="text-sm text-tg-text-light">
                    {product.seller.firstName && product.seller.lastName 
                      ? `${product.seller.firstName} ${product.seller.lastName}`
                      : "Unknown Seller"
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-tg-warning fill-current" />
                    <span className="text-sm text-tg-text-light ml-1">
                      {product.rating || "0"} ({product.ratingCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl text-tg-blue">${product.price}</div>
                <Badge variant={Number(product.stock) > 0 ? "default" : "destructive"}>
                  {Number(product.stock) > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>
            </div>
            
            {product.description && (
              <div className="mt-4">
                <h3 className="font-medium text-tg-text mb-2">Description</h3>
                <p className="text-tg-text-light text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add to Cart Button */}
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <Button
            onClick={handleAddToCart}
            disabled={Number(product.stock) === 0 || addToCartMutation.isPending}
            className="w-full py-3 bg-tg-blue text-white font-medium"
            size="lg"
          >
            {addToCartMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </div>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
