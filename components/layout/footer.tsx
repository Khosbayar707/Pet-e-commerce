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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500">
                <Cat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                My<span className="text-orange-400">Cat</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium products for your beloved feline companions. We believe every cat deserves the best.
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
                  className="h-8 w-8 rounded-full bg-gray-800 hover:bg-orange-500 transition-colors flex items-center justify-center text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/products", label: "All Products" },
                { href: "/categories/food-treats", label: "Food & Treats" },
                { href: "/categories/toys", label: "Toys" },
                { href: "/categories/accessories", label: "Accessories" },
                { href: "/categories/health-care", label: "Health Care" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Account</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/account", label: "My Account" },
                { href: "/account/orders", label: "Order History" },
                { href: "/account/wishlist", label: "Wishlist" },
                { href: "/login", label: "Sign In" },
                { href: "/register", label: "Register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm">Get exclusive offers and tips for your cat.</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1"
              />
              <Button size="sm" type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2 text-sm pt-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>support@mycat.store</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>1-800-MY-CATS</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MyCat Store. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-gray-300">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
