import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "./_manager";

export const metadata: Metadata = { title: "Admin — Categories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
