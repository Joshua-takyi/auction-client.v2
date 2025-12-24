import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationSystem } from "@/components/ui/NotificationSystem";
import { QueryProvider } from "@/provider/queryProvider";
import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main className="grow">{children}</main>
            <Footer />
            <NotificationSystem />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
