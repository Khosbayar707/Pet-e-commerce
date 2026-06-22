import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl">🐱</div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Хуудас олдсонгүй</h2>
        <p className="text-gray-500 max-w-sm">
          Энэ хуудас сониуч муур шиг зугатаж одлоо. Нүүр хуудас руу буцъя.
        </p>
        <Link href="/">
          <Button size="lg">Нүүр хуудас руу</Button>
        </Link>
      </div>
    </div>
  );
}
