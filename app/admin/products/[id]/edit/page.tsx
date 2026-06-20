import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../_form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Admin — Edit Product" };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          sku: product.sku,
          stock: product.stock,
          brand: product.brand,
          categoryId: product.categoryId,
          featured: product.featured,
          status: product.status,
          tags: product.tags,
        }}
      />
    </div>
  );
}
