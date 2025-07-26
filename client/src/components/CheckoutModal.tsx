import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [selectedPayment, setSelectedPayment] = useState("bitcoin");
  const [shippingAddress, setShippingAddress] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    retry: false,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const subtotal = cartItems.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0
      );
      const shipping = 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      const orderItems = cartItems.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: parseFloat(item.product.price),
      }));

      await apiRequest("POST", "/api/orders", {
        total: total.toFixed(2),
        paymentMethod: selectedPayment,
        shippingAddress,
        orderItems,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      onClose();
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
        description: "Failed to place order",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum: number, item: any) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const paymentMethods = [
    { id: "bitcoin", name: "Bitcoin", icon: "₿", description: "Pay with BTC" },
    { id: "ethereum", name: "Ethereum", icon: "Ξ", description: "Pay with ETH" },
    { id: "telegram-stars", name: "Telegram Stars", icon: "⭐", description: "Pay with Stars" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="absolute inset-4 bg-tg-card rounded-2xl overflow-hidden flex flex-col max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Checkout</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-4 h-4 text-tg-text-light" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Order Summary */}
          <div>
            <h4 className="font-medium mb-3">Order Summary</h4>
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-tg-blue">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-medium mb-3">Payment Method</h4>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant="outline"
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 h-auto flex items-center space-x-3 ${
                    selectedPayment === method.id 
                      ? "border-tg-blue bg-blue-50" 
                      : "border-gray-200"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-tg-text-light">{method.description}</div>
                  </div>
                  {selectedPayment === method.id && (
                    <Check className="w-5 h-5 text-tg-blue" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <Label htmlFor="address" className="font-medium mb-3 block">Shipping Address</Label>
            <Textarea
              id="address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your full shipping address..."
              className="bg-tg-bg"
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={() => createOrderMutation.mutate()}
            disabled={!shippingAddress.trim() || createOrderMutation.isPending}
            className="w-full py-3 bg-tg-blue text-white rounded-xl font-medium"
          >
            {createOrderMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Complete Payment - $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
