"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, ...data } = parsed.data;
  const slug = slugify(name);

  await prisma.category.create({ data: { name, slug, ...data } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, ...data } = parsed.data;

  await prisma.category.update({
    where: { id },
    data: { name, slug: slugify(name), ...data },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Cannot delete category with associated products" };
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

