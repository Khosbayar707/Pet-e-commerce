import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Users, ShoppingBag, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, status: "ACTIVE" },
      take: 5,
      orderBy: { stock: "asc" },
    }),
  ]);

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(Number(totalRevenue._sum.total ?? 0)),
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Active Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const statusColors: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
    PENDING: "secondary",
    CONFIRMED: "outline",
    PROCESSING: "secondary",
    SHIPPED: "default",
    DELIVERED: "success",
    CANCELLED: "destructive",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.user.name ?? order.user.email}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={statusColors[order.status] ?? "secondary"} className="text-xs">
                        {order.status}
                      </Badge>
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(Number(order.total))}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" /> Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">All products are well stocked</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{product.name}</p>
                    </div>
                    <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                      {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
