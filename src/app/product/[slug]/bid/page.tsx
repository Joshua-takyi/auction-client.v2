"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Mock initial data
const INITIAL_BIDS = [
  { id: 1, bidder: "Anonymous", amount: 42000, time: "10:00:00" },
  { id: 2, bidder: "Collector_88", amount: 42500, time: "10:05:30" },
  { id: 3, bidder: "Anonymous", amount: 43000, time: "10:12:15" },
  { id: 4, bidder: "J.S. Holdings", amount: 44200, time: "10:20:00" },
  { id: 5, bidder: "Anonymous", amount: 45000, time: "10:25:45" },
];

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: "var(--background)",
  border: "1px solid var(--border)",
  color: "var(--foreground)",
  fontSize: "12px",
  padding: "8px",
};

export default function BidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentPrice = bids[bids.length - 1].amount;
  const minIncrement = 1000;
  const minBid = currentPrice + minIncrement;
  const activeBidders = new Set(bids.map((b) => b.bidder)).size + 3; // +3 lurking

  // Simulate live connection and incoming bids
  useEffect(() => {
    setIsConnected(true);
    // Scroll to bottom of chat
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Random incoming bid simulation
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const lastBid = bids[bids.length - 1]; // This is stale in interval, but ok for mock
        setBids((prev) => {
          const last = prev[prev.length - 1];
          const newAmount =
            last.amount + (Math.floor(Math.random() * 5) + 1) * 500;
          const newBid = {
            id: prev.length + 1,
            bidder:
              Math.random() > 0.5
                ? "Anonymous"
                : `Bidder_${Math.floor(Math.random() * 999)}`,
            amount: newAmount,
            time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          };
          return [...prev, newBid];
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll effect when bids change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [bids]);

  const placeBid = (amount: number) => {
    const newBid = {
      id: bids.length + 1,
      bidder: "You",
      amount: amount,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    };
    setBids((prev) => [...prev, newBid]);
    setBidAmount("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <Link href={`/product/${id}`} className="text-sm hover:opacity-70">
            &larr; Exit Room
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></span>
            <span className="text-xs font-mono uppercase text-muted-foreground">
              {isConnected ? "Live Connected" : "Connecting..."}
            </span>
          </div>
        </div>
        <div className="font-serif font-medium">Room #2526</div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px)]">
        {/* Chart & Vis Section */}
        <div className="flex-1 p-6 relative flex flex-col border-b md:border-b-0 md:border-r border-border">
          <div className="absolute top-6 left-6 z-10">
            <h1 className="text-2xl font-serif font-medium">
              Vintage Patek Philippe Ref. 2526
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Lot 42 • Enamel Dial
            </p>
          </div>

          <div className="flex-1 min-h-[300px] mt-16 md:mt-0 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={bids}>
                <defs>
                  <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--foreground)"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--foreground)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={CUSTOM_TOOLTIP_STYLE}
                  itemStyle={{ color: "var(--foreground)" }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Bid Amount",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBids)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar: Bids & Action */}
        <div className="w-full md:w-[400px] flex flex-col bg-muted/5">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 border-b border-border divide-x divide-border">
            <div className="p-4 text-center">
              <span className="block text-xs text-muted-foreground uppercase tracking-wider">
                Active Bidders
              </span>
              <span className="block text-xl font-medium mt-1">
                {activeBidders}
              </span>
            </div>
            <div className="p-4 text-center">
              <span className="block text-xs text-muted-foreground uppercase tracking-wider">
                Time Remaining
              </span>
              <span className="block text-xl font-medium mt-1 text-red-600">
                2h 14m
              </span>
            </div>
          </div>

          {/* Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="flex items-center justify-between text-sm animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono text-xs">
                    {bid.time}
                  </span>
                  <span
                    className={`font-medium ${
                      bid.bidder === "You"
                        ? "text-yellow-600"
                        : "text-foreground"
                    }`}
                  >
                    {bid.bidder}
                  </span>
                </div>
                <div className="font-semibold">
                  ${bid.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-border bg-background">
            <div className="mb-4 flex justify-between items-end">
              <span className="text-sm text-muted-foreground">
                Current Price
              </span>
              <span className="text-3xl font-semibold">
                ${currentPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              {[1000, 2000, 5000].map((inc) => (
                <button
                  key={inc}
                  onClick={() => placeBid(currentPrice + inc)}
                  className="flex-1 py-2 text-xs border border-border hover:bg-muted transition-colors rounded-sm"
                >
                  + ${inc.toLocaleString()}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = parseFloat(bidAmount);
                if (!isNaN(val) && val >= minBid) {
                  placeBid(val);
                }
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={minBid.toString()}
                  className="w-full bg-muted/10 border border-border py-3 pl-7 pr-4 focus:outline-none focus:border-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={!bidAmount || parseFloat(bidAmount) < minBid}
                className="bg-foreground text-background px-6 font-medium uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Bid
              </button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-3">
              Minimum next bid: ${minBid.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
