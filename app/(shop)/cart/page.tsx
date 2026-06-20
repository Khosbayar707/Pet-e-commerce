import type { Metadata } from "next";
import { CartClient } from "./_client";

export const metadata: Metadata = {
  title: "Shopping Cart",
};

export default function CartPage() {
  return <CartClient />;
}
