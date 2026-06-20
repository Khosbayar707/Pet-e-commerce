"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().positive().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  brand: z.string().optional(),
  categoryId: z.string(),
  featured: z.coerce.boolean().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"]).optional(),
  tags: z.string().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, tags, ...data } = parsed.data;
  const slug = slugify(name);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      ...data,
    },
  });

  const imageFiles = formData.getAll("images") as File[];
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    if (file.size === 0) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    const { url, publicId } = await uploadImage(base64);
    await prisma.productImage.create({
      data: { url, publicId, productId: product.id, order: i },
    });
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, productId: product.id };
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, tags, ...data } = parsed.data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      ...data,
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!product) return { error: "Product not found" };

  for (const image of product.images) {
    if (image.publicId) await deleteImage(image.publicId);
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function getProducts(params: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}) {
  const { category, brand, minPrice, maxPrice, sort = "newest", page = 1, limit = 12, search, featured } = params;

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (category) where.category = { slug: category };
  if (brand) where.brand = brand;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice) (where.price as Record<string, number>).lte = maxPrice;
  }
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (featured !== undefined) where.featured = featured;

  const orderBy: Record<string, string> =
    sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, totalPages: Math.ceil(total / limit) };
}

