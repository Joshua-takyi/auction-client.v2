import { convertCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import TimeLeft from "./timeInterval";

interface Product {
  id: string;
  name: string;
  price: string;
  images: [string];
  bids: number;
  timeLeft: string;
  status?: "live" | "upcoming" | "featured";
}

interface Product {
  id: string;
  name: string;
  price: string;
  images: [string];
  bids: number;
  timeLeft: string; // e.g., "Thu, Dec 4, 08:00AM GMT"
  endTime?: string; // e.g., "Sun, Dec 14, 03:00PM GMT"
  status?: "live" | "upcoming" | "featured";
  auctioneer?: string;
  catalogCount?: number;
  slug?: string;
}

export interface Auction {
  id: string;
  product_id: string;
  min_increment: string;
  reserve_price: string;
  current_bid: string;
  buy_now_price: string;
  buy_now: boolean;
  estimated_price: string;
  start_price: string;
  start_time: string;
  end_time: string;
  winner_id: string | null;
  status: string;
  room_id: string;
  created_at: string;
  updated_at: string;
  products: {
    id: string;
    owner_id: string;
    title: string;
    category: string;
    description: string;
    slug: string;
    brand: string;
    specs: Record<string, any> | null;
    images: string[];
    status: string;
    created_at: string;
    updated_at: string;
  };
}

const parsedImages = (images?: string[]) => {
  if (!images) return [];
  return images
    .map((image) => image.replace(/\s+/g, ""))
    .filter((img) => img.length > 0);
};

export default function ProductCard({ auction }: { auction: Auction }) {
  const status = auction?.status?.toLowerCase() ?? "";
  const isLive = status === "live";
  const isUpcoming = status === "scheduled";
  const isFeatured = status === "featured";

  return (
    <Link
      href={`/product/${auction?.products?.slug}--${auction?.id}`}
      className="group block h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-muted/10">
        <Image
          src={parsedImages(auction?.products?.images)[0]}
          alt={auction?.products?.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
        />

        {/* Triangle Status Badge */}
        <div className="absolute top-0 left-0 z-20">
          <div
            className={`w-12 h-12 relative flex items-start justify-start pl-1 pt-1 ${isLive ? "text-foreground" : "text-background"
              }`}
          >
            <div
              className={`absolute inset-0 ${isLive ? "bg-background/95" : "bg-foreground/90"
                } backdrop-blur-md`}
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
            <div className="relative z-10 -rotate-45 transform origin-center translate-y-0.5 -translate-x-px">
              {isLive ? (
                <span className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider">
                    Live
                  </span>
                </span>
              ) : isUpcoming ? (
                <span className="text-[8px] font-bold uppercase tracking-wider ml-0.5">
                  Soon
                </span>
              ) : isFeatured ? (
                <span className="text-[8px] font-bold uppercase tracking-wider ml-0.5">
                  Hot
                </span>
              ) : (
                <span className="text-[8px] font-bold uppercase tracking-wider ml-0.5">
                  Hot
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-background text-foreground px-4 py-2 text-xs uppercase tracking-widest font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Lot
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-serif text-foreground leading-tight group-hover:underline decoration-1 underline-offset-4 line-clamp-1">
            {auction?.products?.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground font-light">{"AURUM Auctions"}</p>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-border/50 mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Current Bid
            </span>
            <span className="font-medium text-[12px]">
              {convertCurrency(
                Number(auction?.current_bid) === 0
                  ? Number(auction?.start_price)
                  : Number(auction?.current_bid)
              )}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Ends In
            </span>
            <span
              className={`font-medium tabular-nums ${isLive ? "text-red-600" : "text-foreground"
                }`}
            >
              <TimeLeft endTime={auction?.end_time} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
