import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = { title: "My Orders" };

const statusColors: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "outline",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function OrdersPage() {
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { include: { images: { take: 1 } } } },
        take: 3,
      },
    },
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
        <Link href="/products" className="text-orange-500 font-medium hover:underline">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right space-y-1">
              <Badge variant={statusColors[order.status] ?? "secondary"}>{order.status}</Badge>
              <p className="text-sm font-bold text-gray-900">{formatPrice(Number(order.total))}</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={item.product.images[0]?.url ?? "/placeholder-product.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {order.items.length === 0 && (
                <p className="text-sm text-gray-400">No items</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
