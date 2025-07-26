import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const { toast } = useToast();
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

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const handleBack = () => {
    window.history.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-tg-warning";
      case "processing":
        return "bg-tg-blue";
      case "shipped":
        return "bg-tg-light";
      case "delivered":
        return "bg-tg-success";
      case "cancelled":
        return "bg-tg-error";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-tg-bg pb-20">
      {/* Header */}
      <div className="bg-tg-card shadow-tg sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-lg text-tg-text">My Orders</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {ordersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tg-blue mx-auto mb-4"></div>
            <p className="text-tg-text-light">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="w-12 h-12 text-tg-text-light mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No orders yet</h3>
              <p className="text-tg-text-light mb-4">Your order history will appear here</p>
              <Button onClick={handleBack} variant="outline">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order History ({orders.length})</h2>
            </div>
            
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-tg-text">Order #{order.id.slice(-8)}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-tg-text-light" />
                        <span className="text-sm text-tg-text-light">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-tg-blue">${order.total}</div>
                      <Badge className={`${getStatusColor(order.status)} text-white capitalize`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {order.paymentMethod && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-tg-text-light">Payment Method:</span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                  )}
                  
                  {order.shippingAddress && (
                    <div className="mt-2">
                      <span className="text-sm text-tg-text-light">Shipping to:</span>
                      <p className="text-sm text-tg-text mt-1 line-clamp-2">{order.shippingAddress}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
