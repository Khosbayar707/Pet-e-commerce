"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("US"),
  couponCode: z.string().optional(),
});

export async function createOrder(
  formData: FormData,
  items: { productId: string; quantity: number; price: number }[]
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to place an order" };

  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const shippingAddress = parsed.data;

  let discount = 0;
  let couponId: string | undefined;

  if (shippingAddress.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: shippingAddress.couponCode.toUpperCase() },
    });
    if (coupon && coupon.active && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      discount =
        coupon.type === "PERCENTAGE"
          ? subtotal * (Number(coupon.value) / 100)
          : Number(coupon.value);
      couponId = coupon.id;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shippingCost - discount;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      subtotal,
      shippingCost,
      discount,
      total,
      couponId,
      shippingAddress,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  revalidatePath("/account/orders");
  return { success: true, orderId: order.id, orderNumber: order.orderNumber };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
      },
    },
  });
}

