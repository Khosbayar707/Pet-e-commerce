import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MyCat — Нэртэй Муурны Дэлгүүр",
    template: "%s | MyCat",
  },
  description:
    "Таны муурт зориулсан нэртэй бүтээгдэхүүнүүд. Хоол, тоглоом, дагалдах хэрэгсэл болон бусад — муурны найзуудад зориулсан.",
  keywords: ["муурны бүтээгдэхүүн", "муурны хоол", "муурны тоглоом", "муурны хэрэгсэл", "pet store"],
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "MyCat",
    title: "MyCat — Нэртэй Муурны Дэлгүүр",
    description: "Таны муурт зориулсан нэртэй бүтээгдэхүүнүүд.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyCat — Нэртэй Муурны Дэлгүүр",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
