"use client";

import { convertCurrency } from "@/utils";

interface BidItemProps {
  bidderName?: string;
  bidderEmail?: string;
  bidderId?: string;
  amount: number | string;
  timestamp: string | Date;
  isLive?: boolean;
}

export const BidItem = ({
  bidderName,
  bidderEmail,
  bidderId,
  amount,
  timestamp,
  isLive = false,
}: BidItemProps) => {
  const formatBidderName = () => {
    if (bidderName) return bidderName;
    if (bidderEmail) {
      const [localPart] = bidderEmail.split("@");
      if (localPart.length <= 3) return localPart + "***";
      return localPart.substring(0, 3) + "***";
    }
    return `Bidder ${bidderId?.slice(0, 8) || "Unknown"}`;
  };

  return (
    <div className={`flex flex-col animate-slide-up items-start w-full`}>
      <div
        className={`bg-white p-4 rounded-lg shadow-sm border ${
          isLive ? "border-blue-100 bg-blue-50/10" : "border-gray-100"
        } w-full group hover:border-blue-200 transition-colors`}
      >
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-bold text-[11px] text-[#0a1f35] uppercase tracking-widest">
            {isLive && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />
            )}
            {formatBidderName()}
          </span>
          <span className="text-[9px] text-gray-300 font-mono">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: isLive ? "2-digit" : undefined,
            })}
          </span>
        </div>
        <div className="text-sm">
          <p className="text-gray-600">
            Offered{" "}
            <span className="text-gray-900 font-serif font-bold text-base ml-1">
              {convertCurrency(amount)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
