import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed" };

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Захиалга баталгаажлаа! 🎉</h1>
          {order && (
            <p className="text-gray-500">Захиалгын дугаар: <strong className="text-gray-900 dark:text-white">{order}</strong></p>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Худалдан авалт хийсэнд баярлалаа! Бид тантай удахгүй и-мэйлээр холбогдох болно. Таны муур шинэ бараануудаа дуртай байх нь!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button variant="outline">Миний захиалгууд</Button>
          </Link>
          <Link href="/products">
            <Button>Үргэлжлүүлэн хэсэх</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
