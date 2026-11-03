// Completed

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/providers/cart-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNook",
  description: "Your modern online bookstore and book sharing platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors">
        <CartProvider>
          <Header />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
