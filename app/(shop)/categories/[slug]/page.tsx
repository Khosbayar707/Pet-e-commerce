import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/product-grid";
import { Breadcrumb } from "@/components/shop/breadcrumb";
import { Pagination } from "@/components/shop/pagination";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description ?? `Browse ${category.name} products for your cat.`,
  };
}

const LIMIT = 12;

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageStr, sort = "newest" } = await searchParams;
  const page = Number(pageStr ?? 1);

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const }
    : sort === "price_desc" ? { price: "desc" as const }
    : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: category.id, status: "ACTIVE" },
      orderBy,
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where: { categoryId: category.id, status: "ACTIVE" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb
        crumbs={[
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
      />
      <div className="mt-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500 mt-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">{total} бүтээгдэхүүн</p>
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
        <Pagination currentPage={page} totalPages={Math.ceil(total / LIMIT)} />
      </div>
    </div>
  );
}
