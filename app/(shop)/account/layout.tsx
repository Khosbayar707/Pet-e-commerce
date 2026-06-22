import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountNav } from "./_nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <AccountNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
