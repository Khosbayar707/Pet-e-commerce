import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusUpdater } from "./_status";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Admin — Order Detail" };

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: { include: { images: { take: 1 } } } } },
      coupon: true,
    },
  });

  if (!order) notFound();

  const shipping = order.shippingAddress as Record<string, string>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.images[0]?.url ?? "/placeholder-product.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(Number(item.price))}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{Number(order.shippingCost) === 0 ? "Free" : formatPrice(Number(order.shippingCost))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-gray-500">{order.user.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-0.5">
              <p>{shipping.firstName} {shipping.lastName}</p>
              <p>{shipping.address1}</p>
              {shipping.address2 && <p>{shipping.address2}</p>}
              <p>{shipping.city}, {shipping.state} {shipping.postalCode}</p>
              <p>{shipping.country}</p>
              {shipping.phone && <p>{shipping.phone}</p>}
            </CardContent>
          </Card>
          {order.trackingNumber && (
            <Card>
              <CardHeader><CardTitle>Tracking</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <p className="font-mono">{order.trackingNumber}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
