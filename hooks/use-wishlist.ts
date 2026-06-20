"use client";

import { useState, useEffect, useCallback } from "react";

const WISHLIST_KEY = "mycat_wishlist";

function getStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(WISHLIST_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getStored());
    const handler = () => setIds(getStored());
    window.addEventListener("wishlist-updated", handler);
    return () => window.removeEventListener("wishlist-updated", handler);
  }, []);

  const toggle = useCallback((productId: string) => {
    const current = getStored();
    const updated = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist-updated"));
    setIds(updated);
  }, []);

  const isWishlisted = useCallback((productId: string) => ids.includes(productId), [ids]);

  return { ids, toggle, isWishlisted };
}
