"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Ерөнхий", icon: User },
  { href: "/account/orders", label: "Захиалгууд", icon: Package },
  { href: "/account/addresses", label: "Хаягууд", icon: MapPin },
  { href: "/account/wishlist", label: "Хүслийн жагсаалт", icon: Heart },
  { href: "/account/settings", label: "Тохиргоо", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-2 shadow-sm">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            pathname === href
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
