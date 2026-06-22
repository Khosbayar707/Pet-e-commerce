"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { getProductsByIds } from "@/actions/products";
import { ProductGrid } from "@/components/shop/product-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type Product = Awaited<ReturnType<typeof getProductsByIds>>[number];

export function WishlistClient() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    getProductsByIds(ids)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [ids]);

  if (ids.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Хүслийн жагсаалт хоосон байна</h2>
        <p className="text-gray-500 mb-6">Дуртай бүтээгдэхүүнээ хадгалаад дараа амархан олоорой.</p>
        <Link href="/products">
          <Button>Бүтээгдэхүүн үзэх</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Хүслийн жагсаалт ({ids.length} бараа)</h2>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
