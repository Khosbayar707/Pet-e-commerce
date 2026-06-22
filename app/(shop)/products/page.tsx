import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/product-grid";
import { Breadcrumb } from "@/components/shop/breadcrumb";
import { Pagination } from "@/components/shop/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFilters } from "./_filters";

export const metadata: Metadata = {
  title: "All Cat Products",
  description: "Browse our full collection of premium cat products.",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    search?: string;
  }>;
}

const LIMIT = 12;

async function ProductList({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const sort = params.sort ?? "newest";
  const search = params.search;
  const category = params.category;
  const brand = params.brand;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (category) where.category = { slug: category };
  if (brand) where.brand = { equals: brand, mode: "insensitive" };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice) (where.price as Record<string, number>).lte = maxPrice;
  }
  if (search) where.name = { contains: search, mode: "insensitive" };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const }
    : sort === "price_desc" ? { price: "desc" as const }
    : sort === "popular" ? { reviews: { _count: "desc" as const } }
    : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {total} бүтээгдэхүүн олдлоо
        </p>
      </div>
      <ProductGrid products={products} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

async function FiltersPanel() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    }),
  ]);
  return (
    <ProductFilters
      categories={categories}
      brands={brands.map((p) => p.brand!).filter(Boolean)}
    />
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb crumbs={[{ label: "Products" }]} />

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <FiltersPanel />
          </Suspense>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {params.search ? `Хайлт: "${params.search}"` : params.category ? "Ангилал" : "Бүх бүтээгдэхүүн"}
            </h1>
          </div>
          <Suspense
            key={JSON.stringify(params)}
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            }
          >
            <ProductList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
