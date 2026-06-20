import Link from "next/link";
import { Cat } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4 py-16">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
          <Cat className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">
          My<span className="text-orange-500">Cat</span>
        </span>
      </Link>
      {children}
    </div>
  );
}
