"use client";

import { BidItem } from "@/components/BidItem";
import TimeLeft from "@/components/timeInterval";
import { useAuctionStore } from "@/hooks/useAuction";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { useBid, useGetBids } from "@/hooks/useBid";
import { convertCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function BidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { listAuctionByID } = useAuctionStore();
  const { data: auctionData, isLoading, error } = listAuctionByID(id);
  const { isConnected, messages } = useAuctionSocket({
    roomId: auctionData?.data?.room_id,
    auctionId: id,
  });
  const { mutate: placeBid, isPending: isPlacingBid } = useBid();
  const { data: bidHistoryData, isLoading: isLoadingBids } = useGetBids(id);

  const auction = auctionData?.data;
  const product = auction?.products;
  const bidHistory = bidHistoryData || [];

  const [bidAmount, setBidAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Filter out bid_placed socket messages if they are already in the refetched history
  const filteredMessages = messages.filter((msg) => {
    if (msg.type !== "bid_placed") return true;
    return !bidHistory.some(
      (h: any) => h.bid_amount.toString() === msg.payload.amount.toString()
    );
  });

  useEffect(() => {
    if (auction) {
      const current = Number(auction.current_bid);
      const start = Number(auction.start_price);
      const increment = Number(auction.min_increment);

      const initialBid = current === 0 ? start : current + increment;
      setBidAmount(initialBid);
    }
  }, [auction]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-serif text-xl animate-pulse">
        Entering the Gallery...
      </div>
    );
  if (error || !auction)
    return (
      <div className="h-screen flex items-center justify-center font-serif text-xl">
        Lot not found.
      </div>
    );

  const handlePlaceBid = () => {
    placeBid({ auctionId: id, amount: bidAmount });
  };

  const showStartingPrice =
    Number(auction.current_bid) === 0
      ? Number(auction.start_price)
      : Number(auction.current_bid);

  const minimumNextBid =
    Number(auction.current_bid) === 0
      ? Number(auction.start_price)
      : Number(auction.current_bid) + Number(auction.min_increment);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans">
      {/* Left Panel - Product & Info (Scrollable) */}
      <div className="flex-1 flex flex-col h-full md:overflow-y-auto scrollbar-hide">
        {/* Navigation */}
        <div className="p-6 border-b border-border sticky top-0 backdrop-blur-md z-10 flex justify-between items-center">
          <Link
            href={`/`}
            className="text-xs font-bold uppercase tracking-widest hover:text-foreground transition-colors flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Collection</span>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
                }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {isConnected ? "Live Connection" : "Attempting Reconnect"}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-12 max-w-2xl mx-auto w-full">
          {product?.images?.[0] && (
            <div className="aspect-4/5 relative w-full mb-12 bg-muted rounded-sm overflow-hidden shadow-sm">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {product?.brand}
              </h2>
              <h1 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                {product?.title}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-border">
              <div>
                <span className="block text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1">
                  Estimate
                </span>
                <span className="text-lg font-serif italic text-foreground">
                  {convertCurrency(auction.estimated_price)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1">
                  Closes In
                </span>
                <span className="text-lg font-medium text-foreground">
                  <TimeLeft endTime={auction.end_time} />
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "overview" ? "" : "overview")
                  }
                  className="w-full flex justify-between items-center text-left font-serif text-xl text-foreground"
                >
                  Provenance & Description
                  <span
                    className={`transform transition-transform duration-300 ${activeTab === "overview" ? "rotate-180" : ""
                      }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {activeTab === "overview" && (
                  <div className="mt-4 text-muted-foreground leading-relaxed text-sm animate-fade-in font-light">
                    <p>{product?.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Feed & Controls */}
      <div className="w-full md:w-[450px] bg-muted/50 border-l border-border flex flex-col h-[60vh] md:h-auto shadow-2xl z-20">
        {/* Feed Header */}
        <div className="p-5 border-b border-border flex justify-between items-center">
          <span className="font-serif font-medium text-lg italic uppercase tracking-wider">
            Live Repository
          </span>
          <span className="bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {messages.length} Activities
          </span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/30 scrollbar-hide">
          {bidHistory.length === 0 && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
              <div className="w-12 h-12 mb-4 border border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-serif italic">
                Awaiting first increment...
              </p>
            </div>
          )}

          {/* Historical Bids */}
          {bidHistory.map((bid: any, i: number) => (
            <BidItem
              key={`history-${i}`}
              bidderName={bid.profiles?.full_name}
              bidderEmail={bid.profiles?.email}
              bidderId={bid.bid_by}
              amount={bid.bid_amount}
              timestamp={bid.created_at}
            />
          ))}

          {/* Live Socket Messages */}
          {filteredMessages.map((msg, i) => (
            <div
              key={`msg-${i}`}
              className={`flex flex-col animate-slide-up ${msg.type === "notification" ? "items-center" : "items-start"
                }`}
            >
              {msg.type === "notification" ? (
                <div className="w-full flex items-center gap-2 my-2">
                  <div className="h-1 flex-1 bg-border" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold whitespace-nowrap text-center">
                    {msg.payload.message}
                  </span>
                  <div className="h-1 flex-1 bg-border" />
                </div>
              ) : (
                <BidItem
                  isLive
                  bidderId={msg.payload.bidderId}
                  amount={msg.payload.amount}
                  timestamp={msg.timestamp}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-background border-t border-border p-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-bold">
                Current Lot Standing
              </p>
              <p className="text-4xl font-serif text-foreground">
                {convertCurrency(showStartingPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-bold underline underline-offset-4">
                Minimum Increment
              </p>
              <p className="text-sm font-bold text-muted-foreground italic">
                {convertCurrency(minimumNextBid)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handlePlaceBid}
              disabled={isPlacingBid || bidAmount < minimumNextBid}
              className="w-full py-5 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground text-xs font-bold uppercase tracking-[0.3em] transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isPlacingBid ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/20 border-t-primary-foreground" />
              ) : (
                "Execute Bid Placement"
              )}
            </button>

            <div className="px-2">
              <input
                type="range"
                min={minimumNextBid}
                max={
                  Number(auction.current_bid) === 0
                    ? Number(auction.start_price) +
                    Number(auction.min_increment) * 20
                    : Number(auction.current_bid) +
                    Number(auction.min_increment) * 20
                }
                step={auction.min_increment}
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-3">
                <span className="text-[10px] font-bold text-muted-foreground/50 uppercase">
                  Valuation
                </span>
                <span className="text-sm font-serif italic text-foreground font-bold">
                  {convertCurrency(bidAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
