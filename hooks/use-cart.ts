"use client";

import { useState, useEffect, useCallback } from "react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

const CART_KEY = "mycat_cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function useCart(): CartState & {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
} {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getStoredCart());
    const handler = () => setItems(getStoredCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    const current = getStoredCart();
    const existing = current.find((i) => i.productId === item.productId);
    let updated: CartItem[];
    if (existing) {
      updated = current.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
          : i
      );
    } else {
      updated = [...current, { ...item, quantity: 1 }];
    }
    saveCart(updated);
    setItems(updated);
  }, []);

  const removeItem = useCallback((productId: string) => {
    const updated = getStoredCart().filter((i) => i.productId !== productId);
    saveCart(updated);
    setItems(updated);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = getStoredCart().map((i) =>
      i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
    );
    saveCart(updated);
    setItems(updated);
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart };
}
