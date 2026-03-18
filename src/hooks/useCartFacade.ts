/**
 * Cart facade hook — combines React Query cart data with UI state from cartStore.
 * Drop-in replacement for the old CartContext `useCart()` hook.
 */
import { useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useCart as useCartQuery,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  cartKeys,
} from '@/hooks/queries/useCart';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

export interface CartFacadeItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  quantity: number;
  cartItemId?: string;
}

export function useCartFacade() {
  const { data: cartData } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isCartOpen, openCart, closeCart } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const items: CartFacadeItem[] = useMemo(() => {
    if (!cartData?.items) return [];
    return cartData.items.map((item) => ({
      id: item.product.id ?? item.productId,
      cartItemId: item.id,
      name: item.product.name,
      price: item.product.price,
      unit: item.product.unit,
      image: item.product.images?.[0] || '/placeholder.svg',
      category: item.product.category?.name || '',
      quantity: item.quantity,
    }));
  }, [cartData]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const addItem = useCallback(
    (product: Omit<CartFacadeItem, 'quantity' | 'cartItemId'>) => {
      if (!isAuthenticated) {
        toast({ title: 'Login required', description: 'Please sign in to add items to cart.' });
        return;
      }
      addToCartMutation.mutate(
        { productId: product.id, quantity: 1 },
        {
          onSuccess: () => {
            toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
          },
          onError: () => {
            toast({ title: 'Unable to add item', description: 'Please try again.' });
          },
        },
      );
    },
    [isAuthenticated, addToCartMutation, toast],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const item = items.find((it) => it.id === productId);
      if (!item?.cartItemId) return;
      removeItemMutation.mutate(item.cartItemId);
    },
    [items, removeItemMutation],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      const item = items.find((it) => it.id === productId);
      if (!item?.cartItemId) return;
      updateItemMutation.mutate({ itemId: item.cartItemId, quantity });
    },
    [items, updateItemMutation, removeItem],
  );

  const clearCart = useCallback(() => {
    if (!isAuthenticated) return;
    clearCartMutation.mutate(undefined);
  }, [isAuthenticated, clearCartMutation]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen: (open: boolean) => (open ? openCart() : closeCart()),
  };
}

