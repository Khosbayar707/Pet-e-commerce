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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Таны сагс хоосон байна</h2>
        <p className="text-gray-500 mb-8">Та одоогоор бүтээгдэхүүн нэмээгүй байна.</p>
        <Link href="/products">
          <Button size="lg" className="gap-2">
            <ShoppingBag className="h-5 w-5" /> Дэлгүүр хэсэх
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb crumbs={[{ label: "Cart" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-8">
        Дэлгүүрийн сагс ({itemCount} бараа)
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-700">
                <Image src={item.image || "/placeholder-product.jpg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                <p className="text-blue-600 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg">
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
                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
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
                Үргэлжлүүлэн хэсэх
              </Button>
            </Link>
            <Button variant="ghost" onClick={clearCart} className="text-gray-500">
              Сагс цэвэрлэх
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 space-y-6 h-fit">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Захиалгын хураангуй</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Нийт дүн ({itemCount} бараа)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Хүргэлт</span>
              <span className="font-medium">
                {shipping === 0 ? <span className="text-green-600">Үнэгүй</span> : formatPrice(shipping)}
              </span>
            </div>
            {subtotal <= 50 && (
              <div className="text-xs text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                Нэмэх {formatPrice(50 - subtotal)} бараа нэмбэл хүргэлт үнэгүй!
              </div>
            )}
          </div>

          <Separator />

          {/* Coupon */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Купон код</p>
            <div className="flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Код оруулах"
                className="flex-1"
              />
              <Button variant="outline" size="sm">Хэрэглэх</Button>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Нийт</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Link href="/checkout">
            <Button className="w-full gap-2" size="lg">
              Төлбөр тооцоо руу <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="text-xs text-gray-400 text-center">
            SSL шифрлэлтээр хамгаалагдсан төлбөр
          </div>
        </div>
      </div>
    </div>
  );
}
