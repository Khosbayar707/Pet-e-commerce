import type { Metadata } from "next";
import { WishlistClient } from "./_client";

export const metadata: Metadata = { title: "My Wishlist" };

export default function WishlistPage() {
  return <WishlistClient />;
}
