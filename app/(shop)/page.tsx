import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, RefreshCw, Headphones, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/product-grid";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "MyCat — Premium Cat Products",
  description: "Premium products for your beloved feline companions.",
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

export default async function HomePage() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 rounded-full px-4 py-1.5 text-sm font-medium">
                <span>🐱</span> Premium Cat Store
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Everything Your <span className="text-orange-500">Cat</span> Deserves
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Curated premium products for your feline companion. From gourmet treats to luxury beds — we&apos;ve got everything your cat needs to live their best life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/categories/food-treats">
                  <Button size="lg" variant="outline" className="gap-2">
                    View Categories
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-500">Happy Cats</div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100 rounded-[40%_60%_60%_40%/60%_40%_60%_40%]" />
                <Image
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop"
                  alt="Happy cat"
                  fill
                  className="object-cover rounded-[40%_60%_60%_40%/60%_40%_60%_40%] mix-blend-multiply"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">😸</div>
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-500">On orders over $50</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4">
                <div className="text-xs text-gray-500 mb-1">New Arrivals</div>
                <div className="font-bold text-orange-500">Weekly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, label: "Quality Guarantee", desc: "100% authentic products" },
              { icon: RefreshCw, label: "Easy Returns", desc: "30-day return policy" },
              { icon: Headphones, label: "24/7 Support", desc: "Always here to help" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-orange-500 uppercase tracking-wider mb-2">Browse</p>
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.length > 0 ? categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 hover:shadow-lg transition-shadow"
            >
              <Image
                src={categoryImages[cat.slug] ?? `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop`}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="font-bold text-lg">{cat.name}</div>
                <div className="text-sm text-white/80">{cat._count.products} products</div>
              </div>
            </Link>
          )) : (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <p>Add categories to see them here.</p>
              <Link href="/admin/categories" className="text-orange-500 hover:underline text-sm mt-1 inline-block">
                Go to Admin →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-orange-500 uppercase tracking-wider mb-2">Handpicked</p>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            </div>
            <Link href="/products?sort=popular" className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No featured products yet.</p>
              <Link href="/admin/products" className="text-orange-500 hover:underline text-sm mt-1 inline-block">
                Add products in Admin →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-10 md:p-16 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 text-[200px] leading-none">🐱</div>
          </div>
          <div className="relative max-w-lg">
            <div className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-3">Limited Time Offer</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 20% Off Your First Order</h2>
            <p className="opacity-90 mb-8 text-lg">
              Use code <strong>NEWCAT20</strong> at checkout. Valid for new customers only.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
                Claim Your Discount
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-orange-500 uppercase tracking-wider mb-2">Just In</p>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            <Link href="/products?sort=newest" className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-orange-500 uppercase tracking-wider mb-2">What Pet Parents Say</p>
          <h2 className="text-3xl font-bold text-gray-900">Loved by Cats & Their Humans</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah M.",
              text: "My cat absolutely loves the food from MyCat! The quality is outstanding and delivery is always fast.",
              rating: 5,
            },
            {
              name: "James K.",
              text: "Best cat store online. The variety of toys kept my kitten entertained for weeks. Highly recommend!",
              rating: 5,
            },
            {
              name: "Emily R.",
              text: "Amazing customer service and super fast shipping. My cats are obsessed with their new beds!",
              rating: 5,
            },
          ].map((review) => (
            <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              <div className="font-semibold text-gray-900">{review.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
