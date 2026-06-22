import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, RefreshCw, Headphones, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/product-grid";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "MyCat — Нэртэй Муурны Дэлгүүр",
  description: "Таны муурт зориулсан нэртэй бүтээгдэхүүнүүд.",
};

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, status: "ACTIVE" },
    take: 8,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getNewArrivals() {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    take: 4,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    take: 6,
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

const categoryImages: Record<string, string> = {
  "food-treats": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
  toys: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  accessories: "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=400&h=400&fit=crop",
  "health-care": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
  grooming: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
  beds: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
};

const categoryMnNames: Record<string, string> = {
  "food-treats": "Хоол & Амттан",
  toys: "Тоглоом",
  accessories: "Дагалдах хэрэгсэл",
  "health-care": "Эрүүл мэнд",
  grooming: "Гоо сайхан",
  beds: "Орны хэрэгсэл",
};

export default async function HomePage() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero — two-column chewy-style */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 rounded-full px-4 py-1.5 text-sm font-semibold">
                <Tag className="h-3.5 w-3.5" /> Шинэ хэрэглэгчдэд 20% хөнгөлөлт
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Таны муурт <br />
                <span className="text-yellow-300">хамгийн сайн</span> бүтээгдэхүүн
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-lg">
                Муурны хоол, тоглоом, дагалдах хэрэгсэл болон бусад — бүгдийг нэг дор. Чанартай, найдвартай, хурдан хүргэлттэй.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products">
                  <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-bold gap-2">
                    Дэлгүүр хэсэх <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-500 hover:text-white bg-transparent">
                    Бүртгүүлж хөнгөлөлт авах
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-sm text-blue-200">Баяртай муур</div>
                </div>
                <div className="h-10 w-px bg-blue-500" />
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-blue-200">Бүтээгдэхүүн</div>
                </div>
                <div className="h-10 w-px bg-blue-500" />
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-sm text-blue-200 ml-1">Үнэлгээ</div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-[420px] h-[380px]">
                <div className="absolute inset-0 bg-blue-500/30 rounded-3xl" />
                <Image
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=500&fit=crop"
                  alt="Баяртай муур"
                  fill
                  className="object-cover rounded-3xl mix-blend-luminosity opacity-90"
                  priority
                />
                <div className="absolute -bottom-3 left-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-lg">🚚</div>
                  <div>
                    <div className="font-bold text-sm">Үнэгүй хүргэлт</div>
                    <div className="text-xs text-gray-500">$50-аас дээш захиалгад</div>
                  </div>
                </div>
                <div className="absolute -top-3 right-4 bg-yellow-400 text-blue-900 rounded-2xl shadow-xl px-4 py-3 text-center">
                  <div className="text-xs font-medium">Шинэ бараа</div>
                  <div className="font-bold text-sm">7 хоног бүр</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-b border-gray-100 bg-gray-50 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: "Үнэгүй хүргэлт", desc: "$50-аас дээш захиалгад" },
              { icon: Shield, label: "Чанарын баталгаа", desc: "100% жинхэнэ бүтээгдэхүүн" },
              { icon: RefreshCw, label: "Амархан буцаалт", desc: "30 хоногийн буцаалтын бодлого" },
              { icon: Headphones, label: "24/7 Дэмжлэг", desc: "Танд үргэлж туслахад бэлэн" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Cards — chewy.com style */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white col-span-1 md:col-span-2">
            <div className="absolute top-0 right-0 text-[140px] leading-none opacity-10">🐱</div>
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Онцгой санал</div>
              <h3 className="text-2xl font-bold mb-2">Шинэ хэрэглэгчдэд<br />20% хөнгөлөлт</h3>
              <p className="text-blue-200 text-sm mb-4">Код: <strong className="text-white">NEWCAT20</strong></p>
              <Link href="/register">
                <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                  Бүртгүүлж авах
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 p-6 text-gray-900">
            <div className="absolute top-0 right-0 text-[120px] leading-none opacity-10">🎁</div>
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-800 mb-2">Хязгаарлагдмал</div>
              <h3 className="text-xl font-bold mb-2">Шинэ бараа<br />7 хоног бүр</h3>
              <p className="text-orange-900 text-sm mb-4">Сүүлийн мэдээ авааарай</p>
              <Link href="/products?sort=newest">
                <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">
                  Шинэ бараа үзэх
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Ангилал</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ангилалаар хайх</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Бүгдийг үзэх <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.length > 0 ? categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition-all dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-700">
                <Image
                  src={categoryImages[cat.slug] ?? `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop`}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight">{categoryMnNames[cat.slug] ?? cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{cat._count.products} бараа</div>
              </div>
            </Link>
          )) : (
            <div className="col-span-6 text-center py-10 text-gray-400 text-sm">
              Ангилал байхгүй байна.
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 dark:bg-slate-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Онцлох</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Онцлох бүтээгдэхүүн</h2>
            </div>
            <Link href="/products?sort=popular" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Бүгдийг үзэх <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p>Онцлох бүтээгдэхүүн байхгүй байна.</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Шинэ</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Шинэ бараа</h2>
            </div>
            <Link href="/products?sort=newest" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Бүгдийг үзэх <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 dark:bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Сэтгэгдэл</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Муурны эздийн үнэлгээ</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Сарантуяа М.",
                text: "Миний муур MyCat-н хоолыг маш их дуртай! Чанар гайхалтай бөгөөд хүргэлт үргэлж хурдан байдаг.",
                rating: 5,
              },
              {
                name: "Жамбал Х.",
                text: "Шилдэг муурны онлайн дэлгүүр. Тоглоомын сонголт маш өргөн бөгөөд миний муурны мааньд таалагдсан!",
                rating: 5,
              },
              {
                name: "Энхмаа Р.",
                text: "Гайхалтай үйлчилгээ, маш хурдан хүргэлт. Миний мууруудыг шинэ оронтой нь маш их баярлалаа!",
                rating: 5,
              },
            ].map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">&ldquo;{review.text}&rdquo;</p>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
