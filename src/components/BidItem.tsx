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
        className={`bg-card p-4 rounded-lg shadow-sm border ${isLive ? "border-primary/20 bg-primary/5" : "border-border"
          } w-full group hover:border-primary/30 transition-colors`}
      >
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-bold text-[11px] text-foreground uppercase tracking-widest">
            {isLive && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
            )}
            {formatBidderName()}
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: isLive ? "2-digit" : undefined,
            })}
          </span>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">
            Offered{" "}
            <span className="text-foreground font-serif font-bold text-base ml-1">
              {convertCurrency(amount)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
