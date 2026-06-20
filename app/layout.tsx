import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MyCat — Premium Cat Products",
    template: "%s | MyCat",
  },
  description:
    "Discover premium products for your beloved cat. Food, toys, accessories, and more — all curated for your feline companion.",
  keywords: ["cat products", "cat food", "cat toys", "cat accessories", "pet store"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MyCat",
    title: "MyCat — Premium Cat Products",
    description: "Premium products for your beloved feline companions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyCat — Premium Cat Products",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
