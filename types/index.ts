import type { Product, ProductImage, Category, Review, User, Order, OrderItem, CartItem, Address, Wishlist, WishlistItem } from "@/app/generated/prisma/client";

export type ProductWithImages = Product & {
  images: ProductImage[];
  category: Category;
  reviews: Review[];
};

export type ProductCardData = Product & {
  images: ProductImage[];
  category: Category;
  _count?: { reviews: number };
};

export type CartItemWithProduct = CartItem & {
  product: Product & { images: ProductImage[] };
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product & { images: ProductImage[] } })[];
};

export type ReviewWithUser = Review & {
  user: Pick<User, "id" | "name" | "image">;
};

export type AddressData = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;

export type WishlistWithProducts = Wishlist & {
  items: (WishlistItem & { product: ProductCardData })[];
};

export interface CartState {
  items: CartItemWithProduct[];
  total: number;
  subtotal: number;
  itemCount: number;
}

export interface FilterParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
  search?: string;
}
