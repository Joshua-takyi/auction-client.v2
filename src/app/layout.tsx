import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NotificationSystem } from "@/components/ui/NotificationSystem";
import { QueryProvider } from "@/provider/queryProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURUM | Luxury Auctions",
  description: "Exclusive curated auctions for the discerning collector.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <QueryProvider>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
          <NotificationSystem />
        </QueryProvider>
      </body>
    </html>
  );
}
