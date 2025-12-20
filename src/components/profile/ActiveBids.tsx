"use client";
import Image from "next/image";
import Link from "next/link";
import { convertCurrency } from "@/utils";
import { useUserBids } from "@/hooks/useAuction";

export default function ActiveBids() {
  const { data: bidsResponse, isLoading, error } = useUserBids();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 bg-white border border-gray-100 p-6 flex gap-6"
          >
            <div className="w-32 aspect-[4/3] bg-gray-100" />
            <div className="flex-1 space-y-4">
              <div className="h-6 w-1/2 bg-gray-100" />
              <div className="h-4 w-1/4 bg-gray-100" />
              <div className="h-12 w-full bg-gray-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !bidsResponse?.data || bidsResponse.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 animate-fade-in">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-gray-400 font-serif italic mb-6">
          No active auction engagements found
        </p>
        <Link
          href="/search"
          className="text-[10px] font-bold uppercase tracking-widest px-8 py-3 border border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
        >
          Browse Auctions
        </Link>
      </div>
    );
  }

  const bids = bidsResponse.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = String(hours).padStart(2, "0") + ":" + minutes + " " + ampm;

    return `${month}/${day}/${year} ${strTime}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif italic text-gray-900">
          Current Engagements
        </h2>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          {bids.length} {bids.length === 1 ? "Active" : "Active"}
        </span>
      </div>

      {bids.map((bid: any) => {
        const auction = bid.auctions;
        const product = auction?.products;
        const title = product?.title || "Unknown Item";
        const image = product?.images?.[0] || "";
        const endTime = auction?.end_time;
        const currentBid = auction?.current_bid || 0;
        const myBid = bid.bid_amount;
        const status = bid.is_winning ? "Leading" : "Outbid";

        return (
          <div
            key={bid.id}
            className="group bg-white p-6 border border-gray-100 hover:border-gray-200 transition-all shadow-sm flex flex-col md:flex-row gap-6"
          >
            <div className="relative w-full md:w-32 aspect-square bg-gray-50 overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif tracking-tight text-gray-900 group-hover:text-amber-900 transition-colors uppercase">
                    {title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                      status === "Leading"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                {endTime && (
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                    Closes: {formatDate(endTime)}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-8 mt-6 border-t border-gray-50 pt-4">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1">
                    Current Price
                  </span>
                  <span className="font-serif text-lg text-gray-900">
                    {convertCurrency(currentBid)}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1">
                    Your Max Bid
                  </span>
                  <span className="font-serif text-lg text-gray-500">
                    {convertCurrency(myBid)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href={`/bid/${auction?.id}`}
                className="w-full md:w-auto text-center px-8 py-3 bg-[#0a1f35] text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all"
              >
                View Lot
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
