"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Search, Menu, X, User, Cat, ChevronDown, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

interface HeaderProps {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

const categoryLinks = [
  { href: "/products", label: "Бүх бүтээгдэхүүн" },
  { href: "/categories/food-treats", label: "Хоол & Амттан" },
  { href: "/categories/toys", label: "Тоглоом" },
  { href: "/categories/accessories", label: "Дагалдах хэрэгсэл" },
  { href: "/categories/health-care", label: "Эрүүл мэнд" },
  { href: "/categories/grooming", label: "Гоо сайхан" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Харанхуй горим"
      className="text-white hover:bg-blue-700 hover:text-white"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { itemCount } = useCart();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <div className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Cat className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-white">
                My<span className="text-yellow-300">Cat</span>
              </span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Бүтээгдэхүүн хайх..."
                  className="pl-9 bg-white border-0 h-10 rounded-full text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-yellow-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <ThemeToggle />

              <Link href="/account/wishlist">
                <Button variant="ghost" size="icon" aria-label="Хүслийн жагсаалт" className="text-white hover:bg-blue-700 hover:text-white">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" aria-label="Сагс" className="text-white hover:bg-blue-700 hover:text-white">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-yellow-400 text-blue-900 hover:bg-yellow-400">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hover:text-white gap-1.5 hidden sm:flex">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {user.name?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                      <ChevronDown className="h-3 w-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">Миний бүртгэл</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">Захиалгууд</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/wishlist">Хүслийн жагсаалт</Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Админ панел</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600">
                      Гарах
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 hover:text-white gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Нэвтрэх</span>
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-blue-700 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Цэс"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-10">
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-md">
          <div className="px-4 py-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Хайх..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <nav className="flex flex-col divide-y divide-gray-100 dark:divide-slate-700">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-medium text-blue-600"
                >
                  Нэвтрэх / Бүртгүүлэх
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
