"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/shop/breadcrumb";
import { Lock } from "lucide-react";

interface CheckoutClientProps {
  user: { id: string; name?: string | null; email?: string | null };
}

export function CheckoutClient({ user }: CheckoutClientProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const nameParts = user.name?.split(" ") ?? ["", ""];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const result = await createOrder(formData, orderItems);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    clearCart();
    router.push(`/checkout/success?order=${result.orderNumber}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb crumbs={[{ label: "Сагс", href: "/cart" }, { label: "Төлбөр тооцоо" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-10">Төлбөр тооцоо</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Хүргэлтийн мэдээлэл</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Нэр *</Label>
                  <Input id="firstName" name="firstName" defaultValue={nameParts[0]} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Овог *</Label>
                  <Input id="lastName" name="lastName" defaultValue={nameParts[1]} required className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">И-мэйл *</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email ?? ""} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Утас</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="address1">Хаяг *</Label>
                <Input id="address1" name="address1" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="address2">Байр, тоот гэх мэт</Label>
                <Input id="address2" name="address2" className="mt-1" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="city">Хот *</Label>
                  <Input id="city" name="city" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="state">Муж/Аймаг *</Label>
                  <Input id="state" name="state" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="postalCode">Шуудангийн код *</Label>
                  <Input id="postalCode" name="postalCode" required className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Улс *</Label>
                <Input id="country" name="country" defaultValue="US" required className="mt-1" />
              </div>
            </div>

            {/* Payment (placeholder) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Төлбөр</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Энэ нь жишээ загвар. Бодит төлбөр хийгдэхгүй.
              </div>
              <div>
                <Label>Картын дугаар</Label>
                <Input className="mt-1" placeholder="4242 4242 4242 4242" readOnly defaultValue="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Дуусах хугацаа</Label>
                  <Input className="mt-1" placeholder="MM/YY" readOnly defaultValue="12/28" />
                </div>
                <div>
                  <Label>CVC</Label>
                  <Input className="mt-1" placeholder="123" readOnly defaultValue="123" />
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2">
              <Input name="couponCode" placeholder="Купон код (жш. NEWCAT20)" className="flex-1" />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Захиалгын хураангуй</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-slate-700">
                      <Image src={item.image || "/placeholder-product.jpg"} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Нийт дүн</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Хүргэлт</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Үнэгүй</span> : formatPrice(shipping)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Нийт</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Захиалга өгч байна..." : `Захиалга өгөх · ${formatPrice(total)}`}
            </Button>
            <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Аюулгүй шифрлэгдсэн төлбөр
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
