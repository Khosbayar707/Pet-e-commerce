import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Heart, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [orderCount, wishlistCount, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { wishlist: { userId } } }),
    prisma.address.count({ where: { userId } }),
  ]);

  const recentOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const user = session!.user!;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-2xl">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">Customer</Badge>
              {recentOrder && (
                <Badge variant="outline">Member since {formatDate(recentOrder.createdAt)}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/account/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{orderCount}</div>
                <div className="text-sm text-gray-500">Orders</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/wishlist">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{wishlistCount}</div>
                <div className="text-sm text-gray-500">Wishlist</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/addresses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{addressCount}</div>
                <div className="text-sm text-gray-500">Addresses</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      {recentOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Recent Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">#{recentOrder.orderNumber}</p>
                <p className="text-sm text-gray-500">{formatDate(recentOrder.createdAt)}</p>
              </div>
              <div className="text-right">
                <Badge variant={recentOrder.status === "DELIVERED" ? "success" : "secondary"}>
                  {recentOrder.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
