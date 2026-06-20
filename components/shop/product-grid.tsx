import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | { toString(): string };
  comparePrice?: number | null | { toString(): string };
  images: { url: string }[];
  category: { name: string };
  brand?: string | null;
  stock: number;
  featured?: boolean;
  _count?: { reviews: number };
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🐱</div>
        <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={Number(product.price)}
          comparePrice={product.comparePrice ? Number(product.comparePrice) : undefined}
          image={product.images[0]?.url ?? ""}
          category={product.category.name}
          brand={product.brand}
          stock={product.stock}
          featured={product.featured}
          reviewCount={product._count?.reviews}
        />
      ))}
    </div>
  );
}
