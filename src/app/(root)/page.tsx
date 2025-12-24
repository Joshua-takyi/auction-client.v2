import Link from "next/link";
import Hero from "@/components/Hero";

export const dynamic = "force-dynamic";

import {
  AuctionActivity,
  AuctionListDynamic,
} from "@/components/AuctionActivity";
import { getAuctions } from "@/lib/data";

export default function Home() {
  const auctionPromise = getAuctions();

  const categories = [
    {
      name: "Watches",
      image: "/images/cat-watch.png",
    },
    {
      name: "Rare Books",
      image: "/images/cat-book.png",
    },
    {
      name: "Fine Art",
      image: "/images/cat-art.png",
    },
    {
      name: "Antiquities",
      image: "/images/cat-antiquity.png",
    },
    {
      name: "Jewelry",
      image: "/images/cat-jewelry.png",
    },
    {
      name: "Numismatics",
      image: "/images/cat-numismatics.png",
    },
    {
      name: "Ceramics",
      image: "/images/cat-ceramics.png",
    },
    {
      name: "Sculpture",
      image: "/images/cat-sculpture.png",
    },
    {
      name: "Militaria",
      image: "/images/cat-militaria.png",
    },
    {
      name: "Furniture",
      image: "/images/cat-furniture.png",
    },
  ];

  return (
    <main className="min-h-screen pb-32">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-24 border-b border-border/40">
        <div className="container-lux">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-12 text-center font-sans">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${decodeURIComponent(cat.name.toLowerCase())}`}
                className="group flex flex-col items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-muted/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                </div>
                <span className="font-serif text-base md:text-lg">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Auction Activity with PPR */}
      <AuctionActivity>
        <AuctionListDynamic auctionPromise={auctionPromise} />

        <div className="mt-20 text-center">
          <Link
            href="/auctions"
            className="inline-block border border-border px-10 py-4 text-sm font-medium hover:bg-foreground hover:text-background transition-colors uppercase tracking-wider"
          >
            View All Lots
          </Link>
        </div>
      </AuctionActivity>

      {/* change this section into a component */}
      {/* Editorial / Collections */}
      <section className="py-32 bg-[#0a0a0a] text-white">
        <div className="container-lux">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                In Focus
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                The Modernist Collection
              </h2>
              <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
                Defining the 20th century through form and function. Explore a
                curated selection of mid-century masterpieces that shaped the
                way we live.
              </p>
              <Link
                href="/collections/modernist"
                className="inline-block border-b border-white pb-1 hover:text-white/70 transition-colors"
              >
                Explore Collection &rarr;
              </Link>
            </div>
            <div className="relative aspect-4/3 overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1594142436400-34825f385157?q=80&w=1200&auto=format&fit=crop')",
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-32">
            <div className="order-2 md:order-1 relative aspect-4/3 overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop')",
                }}
              />
            </div>
            <div className="order-1 md:order-2 space-y-8 md:pl-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Upcoming
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Fine Living & Estates
              </h2>
              <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
                From antique silver to contemporary art, discover unique items
                from prestigious estates across the globe.
              </p>
              <Link
                href="/collections/estates"
                className="inline-block border-b border-white pb-1 hover:text-white/70 transition-colors"
              >
                View Catalog &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Selling Section */}
      <section className="py-32 border-b border-border">
        <div className="container-lux text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-serif">Consign with AURUM</h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Join our community of sellers and reach a global audience of
            passionate collectors. Our experts will guide you through every step
            of the process.
          </p>
          <div className="pt-4">
            <Link
              href="/sell"
              className="bg-foreground text-background px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
            >
              Submit an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-muted/5">
        <div className="container-lux text-center">
          <h3 className="text-xl font-serif mb-4">Stay Informed</h3>
          <p className="text-muted-foreground mb-8 text-sm">
            Subscribe for updates on new auctions and editorial stories.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 bg-transparent border-b border-border px-0 py-2 focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="button"
              className="text-xs font-bold uppercase tracking-widest hover:opacity-70"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
