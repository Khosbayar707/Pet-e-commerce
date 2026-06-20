"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
  featured?: boolean;
  brand?: string | null;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  stock,
  featured,
  brand,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(id);
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (stock === 0) return;
    addItem({ id: crypto.randomUUID(), productId: id, name, price, image, stock });
    toast.success(`${name} added to cart!`);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image || "/placeholder-product.jpg"}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {featured && <Badge>Featured</Badge>}
            {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
            {stock === 0 && <Badge variant="secondary">Out of Stock</Badge>}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full bg-white shadow transition-all opacity-0 group-hover:opacity-100",
              wishlisted && "opacity-100"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-gray-400")}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="text-xs text-orange-500 font-medium uppercase tracking-wide">{category}</div>
          {brand && <div className="text-xs text-gray-400">{brand}</div>}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{name}</h3>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3 w-3",
                      star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}

          {/* Price & Cart */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-base font-bold text-gray-900">{formatPrice(price)}</span>
              {comparePrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(comparePrice)}</span>
              )}
            </div>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleAddToCart}
              disabled={stock === 0}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
