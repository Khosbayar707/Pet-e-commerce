"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
  productId: z.string(),
});

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to leave a review" };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { productId, ...data } = parsed.data;

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  if (existing) return { error: "You already reviewed this product" };

  await prisma.review.create({
    data: { ...data, productId, userId: session.user.id },
  });

  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function approveReview(reviewId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.review.update({ where: { id: reviewId }, data: { approved: true } });
  revalidatePath("/admin");
  return { success: true };
}

