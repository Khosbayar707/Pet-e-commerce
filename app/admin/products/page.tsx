import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteProductButton } from "./_delete-button";

export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { take: 1 },
      category: true,
      _count: { select: { orderItems: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    ACTIVE: "default",
    DRAFT: "secondary",
    OUT_OF_STOCK: "destructive",
    ARCHIVED: "outline",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Stock</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Sales</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-orange-500 hover:underline">
                    Add your first product
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images[0]?.url ? (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-lg">🐱</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                        {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category.name}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(Number(product.price))}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? "text-red-600 font-medium" : product.stock <= 5 ? "text-orange-500 font-medium" : "text-gray-900"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColors[product.status] ?? "secondary"} className="text-xs">
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product._count.orderItems}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
