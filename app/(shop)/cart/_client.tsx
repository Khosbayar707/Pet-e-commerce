"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Breadcrumb } from "@/components/shop/breadcrumb";
import { useState } from "react";

export function CartClient() {
  const { items, subtotal, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any products yet.</p>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            <ShoppingBag className="h-5 w-5" /> Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb crumbs={[{ label: "Cart" }]} />
      <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-8">
        Shopping Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <Image src={item.image || "/placeholder-product.jpg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-orange-500 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-50 rounded-l-lg"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-50 rounded-r-lg"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="ghost" onClick={clearCart} className="text-gray-500">
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-6 h-fit">
          <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal ({itemCount} items)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}
              </span>
            </div>
            {subtotal <= 50 && (
              <div className="text-xs text-gray-400 bg-orange-50 rounded-lg px-3 py-2">
                Add {formatPrice(50 - subtotal)} more for free shipping!
              </div>
            )}
          </div>

          <Separator />

          {/* Coupon */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Coupon Code</p>
            <div className="flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter code"
                className="flex-1"
              />
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Link href="/checkout">
            <Button className="w-full gap-2" size="lg">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="text-xs text-gray-400 text-center">
            Secure checkout powered by SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}
