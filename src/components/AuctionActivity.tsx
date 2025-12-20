"use client";

import { use, Suspense } from "react";
import ProductCard, { Auction } from "./ProductCard";

export function AuctionListDynamic({
  auctionPromise,
}: {
  auctionPromise: Promise<Auction[]>;
}) {
  // Unwraps the promise. If it's still pending, the parent Suspense boundary kicks in.
  const auctions = use(auctionPromise);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
      {auctions.map((item: any) => (
        <ProductCard key={item.id} auction={item} />
      ))}
    </div>
  );
}

// Skeleton for PPR (Partial Prerendering)
export function AuctionListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-square bg-muted/20 rounded-lg" />
          <div className="h-4 bg-muted/20 w-3/4" />
          <div className="h-4 bg-muted/20 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// High-level "Activity" component for React 19 concurrent features
export function AuctionActivity({ children }: { children: React.ReactNode }) {
  return (
    <section id="auctions" className="container-lux py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif mb-3 font-medium tracking-tight">
            Curated Selections
          </h2>
          <p className="text-muted-foreground text-lg font-light max-w-md">
            Exceptional pieces available for immediate acquisition.
          </p>
        </div>
      </div>

      {/* Suspense enables PPR here: the shell (above) is static, 
            the children (auctions) are dynamic. */}
      <Suspense fallback={<AuctionListSkeleton />}>{children}</Suspense>
    </section>
  );
}
