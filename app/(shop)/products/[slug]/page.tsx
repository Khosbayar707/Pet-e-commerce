import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/shop/breadcrumb";
import { StarRating } from "@/components/shop/star-rating";
import { ProductGrid } from "@/components/shop/product-grid";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductActions } from "./_actions";
import { ReviewSection } from "./_reviews";
import { formatPrice } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Truck, Shield, RefreshCw } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1 } },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    take: 4,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
      _count: { select: { reviews: true } },
    },
  });

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb
        crumbs={[
          { label: "Products", href: "/products" },
          { label: product.category.name, href: `/categories/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={product.images[0]?.url || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category.name}</Badge>
              {product.brand && <Badge variant="outline">{product.brand}</Badge>}
              {product.featured && <Badge>Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* Rating Summary */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={avgRating} size="md" />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-gray-900">{formatPrice(Number(product.price))}</span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(Number(product.comparePrice))}</span>
                <Badge variant="destructive">
                  -{Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)}%
                </Badge>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium text-gray-700">
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          <Separator />

          {/* Add to Cart */}
          <ProductActions product={{ id: product.id, name: product.name, price: Number(product.price), stock: product.stock, image: product.images[0]?.url ?? "" }} />

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications as object).length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <dl className="space-y-2">
                {Object.entries(product.specifications as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="flex gap-4 text-sm">
                    <dt className="text-gray-500 w-28 flex-shrink-0 capitalize">{key}</dt>
                    <dd className="text-gray-900 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Trust */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { icon: Truck, label: "Free shipping over $50" },
              { icon: Shield, label: "Quality guarantee" },
              { icon: RefreshCw, label: "30-day returns" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 text-center">
                <item.icon className="h-5 w-5 text-orange-500" />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          {product.sku && (
            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ReviewSection
          product={{ id: product.id, slug: product.slug }}
          reviews={product.reviews}
          avgRating={avgRating}
          userId={session?.user?.id}
        />
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
