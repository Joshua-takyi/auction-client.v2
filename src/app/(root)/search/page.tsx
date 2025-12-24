"use client";
import { useSearchParams } from "next/navigation";
import { useSearchAuctions } from "@/hooks/useAuction";
import Link from "next/link";
import Image from "next/image";
import { convertCurrency } from "@/utils";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSearchAuctions({ q: query, limit: 20 });

  return (
    <div className="container-lux">
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400 mb-4">
          Search Results
        </h1>
        <p className="text-3xl font-serif italic text-gray-900">
          &ldquo;{query}&rdquo;
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-4/5 bg-gray-100 rounded-sm" />
              <div className="h-4 bg-gray-100 w-2/3" />
              <div className="h-4 bg-gray-100 w-1/3" />
            </div>
          ))}
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-sm">
          <p className="text-gray-400 font-serif italic text-lg">
            No lots found matching your request.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-xs font-bold uppercase tracking-widest underline underline-offset-4"
          >
            Back to Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-16">
          {data.data.map((auction) => (
            <Link
              key={auction.id}
              href={`/product/${auction?.products?.slug}--${auction?.id}`}
              className="group block space-y-4"
            >
              <div className="aspect-3/4 bg-gray-50 relative overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700">
                {auction.products?.images?.[0] ? (
                  <Image
                    src={auction.products.images[0]}
                    alt={auction.products.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-[9px] font-bold px-3 py-1 uppercase tracking-tighter text-gray-900 border border-gray-100">
                    {auction.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  {auction.products?.brand || "Curated"}
                </h3>
                <h2 className="text-base font-serif text-gray-900 group-hover:italic transition-all">
                  {auction.products?.title}
                </h2>
                <div className="pt-2 flex justify-between items-baseline border-t border-gray-50 mt-4">
                  <span className="text-[9px] uppercase font-bold text-gray-400">
                    Current Bid
                  </span>
                  <span className="text-sm font-medium">
                    {convertCurrency(
                      auction.current_bid || auction.start_price
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
// get to know how to use the suspense 
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <Suspense
        fallback={<div className="container-lux animate-pulse">Loading...</div>}
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
