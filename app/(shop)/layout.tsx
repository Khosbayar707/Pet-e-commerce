import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/lib/auth";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
