import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const metadata: Metadata = { title: "Admin — Orders" };

const statusColors: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "outline",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} orders total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Order</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Items</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">No orders yet</td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">#{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{order.user.name}</p>
                  <p className="text-xs text-gray-400">{order.user.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-gray-500">{order._count.items}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(Number(order.total))}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusColors[order.status] ?? "secondary"}>{order.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
