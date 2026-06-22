"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1),
});

const addressSchema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.coerce.boolean().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/account/settings");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { currentPassword, newPassword, confirmPassword } = parsed.data;
  if (newPassword !== confirmPassword) return { error: "Passwords do not match" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) return { error: "Cannot update password for this account" };

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return { error: "Current password is incorrect" };

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

  return { success: true };
}

export async function createAddress(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateAddress(addressId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });
  if (!address) return { error: "Address not found" };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.update({ where: { id: addressId }, data: parsed.data });

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.address.deleteMany({
    where: { id: addressId, userId: session.user.id },
  });

  revalidatePath("/account/addresses");
  return { success: true };
}
