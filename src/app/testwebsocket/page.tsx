"use client";

import { useAuctionSocket } from "@/hooks/useAuctionSocket";

export default function TestWebSocket() {
  const { isConnected } = useAuctionSocket({ auctionId: "1" });
  return <div>Test WebSocket {isConnected ? "Connected" : "Disconnected"}</div>;
}
