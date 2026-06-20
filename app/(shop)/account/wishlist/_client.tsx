"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function WishlistClient() {
  const { ids } = useWishlist();

  if (ids.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save products you love to find them easily later.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Wishlist ({ids.length} items)</h2>
      <div className="grid grid-cols-2 gap-4">
        {ids.map((id) => (
          <div key={id} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-500">Product ID: {id.slice(0, 8)}…</p>
            <Link href={`/products`} className="text-orange-500 text-xs hover:underline">
              View Product
            </Link>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Note: Wishlist is stored locally. Sign in and save items server-side for persistence across devices.
      </p>
    </div>
  );
}
