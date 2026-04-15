import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Product, CartItem } from "@/api/api";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => api.getCart(),
  });

  const addItemMutation = useMutation({
    mutationFn: (productId: number) => api.addToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => api.updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) => api.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => api.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const items = cartData?.items || [];

  const addToCart = useCallback((product: Product) => {
    addItemMutation.mutate(product.id);
  }, [addItemMutation]);

  const removeFromCart = useCallback((productId: number) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      removeItemMutation.mutate(item.id);
    }
  }, [items, removeItemMutation]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      updateItemMutation.mutate({ id: item.id, quantity });
    }
  }, [items, updateItemMutation]);

  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  const totalItems = cartData?.total_items || 0;
  const subtotal = cartData?.total_price || 0;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
