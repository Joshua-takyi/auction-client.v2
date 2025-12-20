"use client";

import { useRef } from "react";
import RecommendationCard from "./RecommendationCard";
import { convertCurrency } from "@/utils";
import { useAuctionStore } from "@/hooks/useAuction";

interface RecommendationProps {
  recommendation: string;
  currentId: string;
}

export default function RecommendationsSection({
  recommendation,
  currentId,
}: RecommendationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { listRecommendations } = useAuctionStore();
  const { data: response } = listRecommendations({
    limit: 10,
    offset: 0,
    category: recommendation,
    current_id: currentId,
  });

  const auctions = response?.data || [];

  if (auctions.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container-lux mt-32 mb-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h3 className="text-2xl font-serif mb-2">You May Also Like</h3>
          <p className="text-muted-foreground text-sm">
            Curated picks just for you.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            aria-label="Scroll left"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            aria-label="Scroll right"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x scroll-pl-4"
      >
        {auctions.map((auction: any) => (
          <div key={auction.id} className="snap-start shrink-0 w-[280px]">
            <RecommendationCard
              product={{
                id: auction.id,
                name: auction.products.title,
                brand: auction.products.brand,
                price: convertCurrency(auction.current_bid),
                estimate: `${convertCurrency(
                  auction.start_price
                )} - ${convertCurrency(auction.estimated_price)}`,
                image: auction.products.images?.[0] || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
