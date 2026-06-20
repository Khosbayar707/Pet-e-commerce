"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  function addToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      });
    }
    toast.success(`${quantity} × ${product.name} added to cart!`);
  }

  function handleWishlist() {
    toggle(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-gray-50 transition-colors rounded-l-lg"
            aria-label="Decrease"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 font-semibold text-gray-900 min-w-[2.5rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-3 hover:bg-gray-50 transition-colors rounded-r-lg"
            aria-label="Increase"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={addToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-5 w-5" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleWishlist}
          className={cn("gap-2", wishlisted && "border-red-200 text-red-500 hover:bg-red-50")}
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-red-500 text-red-500")} />
        </Button>
      </div>
    </div>
  );
}
