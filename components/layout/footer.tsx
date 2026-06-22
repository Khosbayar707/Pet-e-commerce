import Link from "next/link";
import { Cat, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                <Cat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                My<span className="text-yellow-300">Cat</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Таны хайртай муурт зориулсан нэртэй бүтээгдэхүүнүүд. Бид муур бүр хамгийн сайныг хүлээн авах ёстой гэж үздэг.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Facebook", icon: "f" },
                { label: "Instagram", icon: "ig" },
                { label: "X", icon: "x" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="h-8 w-8 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Дэлгүүр</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/products", label: "Бүх бүтээгдэхүүн" },
                { href: "/categories/food-treats", label: "Хоол & Амттан" },
                { href: "/categories/toys", label: "Тоглоом" },
                { href: "/categories/accessories", label: "Дагалдах хэрэгсэл" },
                { href: "/categories/health-care", label: "Эрүүл мэнд" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Бүртгэл</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/account", label: "Миний бүртгэл" },
                { href: "/account/orders", label: "Захиалгын түүх" },
                { href: "/account/wishlist", label: "Хүслийн жагсаалт" },
                { href: "/login", label: "Нэвтрэх" },
                { href: "/register", label: "Бүртгүүлэх" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Мэдээлэл авах</h3>
            <p className="text-sm">Онцгой санал болон муурт зориулсан зөвлөмжүүдийг аваарай.</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="И-мэйл хаяг"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1"
              />
              <Button size="sm" type="submit" className="whitespace-nowrap bg-blue-600 hover:bg-blue-700">
                Бүртгүүлэх
              </Button>
            </form>
            <div className="space-y-2 text-sm pt-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>support@mycat.store</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>+976 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>Улаанбаатар, Монгол</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MyCat Store. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300">Нууцлалын бодлого</Link>
            <Link href="/terms" className="hover:text-gray-300">Үйлчилгээний нөхцөл</Link>
            <Link href="/shipping" className="hover:text-gray-300">Хүргэлтийн нөхцөл</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
