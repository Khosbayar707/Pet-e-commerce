import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../_form";

export const metadata: Metadata = { title: "Admin — Add Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to add a new product.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
