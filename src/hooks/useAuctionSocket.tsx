import { useEffect, useRef, useState, useCallback } from "react";
import useApiStore from "@/store/apistore";
import { useNotificationStore } from "@/store/notificationStore";
import { useQueryClient } from "@tanstack/react-query";

export type AuctionMessageType =
  | "bid_placed"
  | "auction_update"
  | "user_joined"
  | "error"
  | "notification";

export interface AuctionMessage {
  type: AuctionMessageType;
  payload: any;
  timestamp: string;
  sender_id?: string;
}

interface UseAuctionSocketProps {
  roomId?: string;
  auctionId?: string;
}

export const useAuctionSocket = ({
  roomId,
  auctionId,
}: UseAuctionSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<AuctionMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<AuctionMessage | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const { api } = useApiStore();
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 2000; // Base interval in ms

  const connect = useCallback(
    async (abortController?: AbortController) => {
      if (!roomId) return;

      // 1. CLEANUP: Ensure any existing connection or pending reconnect is cleared
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      try {
        // 2. SECURITY & AUTH: Fetch a single-use ticket
        // We pass the signal to cancel the request if the component unmounts quickly
        const { data } = await api.post(
          "/ws/ticket",
          {},
          {
            signal: abortController?.signal,
          }
        );
        const ticket = data.data.ticket;

        // 3. CONNECTION: Establish the WebSocket
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = process.env.NEXT_PUBLIC_API_URL || "localhost:8080";
        const baseUrl = host.includes("://") ? host.split("://")[1] : host;
        const url = `${protocol}//${baseUrl}/api/v1/ws/auctions/${roomId}?ticket=${ticket}`;

        // establish a new websocket connection
        const socket = new WebSocket(url);

        socket.onopen = () => {
          console.log(`[WebSocket] Connected to room: ${roomId}`);
          setIsConnected(true);
          reconnectCountRef.current = 0; // Reset reconnect counter on success
        };

        socket.onmessage = (event) => {
          try {
            const rawData = JSON.parse(event.data);
            const msg: AuctionMessage = {
              type: rawData.type || "auction_update",
              payload: rawData.payload || rawData,
              timestamp: new Date().toISOString(),
              sender_id: rawData.sender_id,
            };

            setMessages((prev) => [...prev, msg].slice(-50)); // Keep last 50 messages
            setLastMessage(msg);

            // REAL-TIME CACHE INVALIDATION
            if (auctionId) {
              if (msg.type === "bid_placed") {
                // Invalidate both auction (for current price) and bids (for history)
                queryClient.invalidateQueries({
                  queryKey: ["auction", auctionId],
                });
                queryClient.invalidateQueries({
                  queryKey: ["auction", auctionId, "bids"],
                });
              } else if (msg.type === "auction_update") {
                queryClient.invalidateQueries({
                  queryKey: ["auction", auctionId],
                });
              }
            }

            // AUTO-NOTIFICATION LOGIC
            if (msg.type === "notification") {
              const { message, priority, type: notifType } = msg.payload;
              addNotification({
                message: message,
                type:
                  priority === "high" || priority === "urgent"
                    ? "error"
                    : "info",
                title: notifType.replace(/_/g, " "),
                variant: "toast",
              });
            }
          } catch (err) {
            console.error("[WebSocket] Message parsing error:", err);
          }
        };

        socket.onerror = (error) => {
          console.error("[WebSocket] Error occurred:", error);
        };

        socket.onclose = (event) => {
          setIsConnected(false);
          socketRef.current = null;

          // 4. RECONNECTION: Only reconnect if it wasn't a normal closure
          if (
            event.code !== 1000 &&
            reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS
          ) {
            const delay =
              RECONNECT_INTERVAL * Math.pow(2, reconnectCountRef.current);
            console.log(
              `[WebSocket] Reconnecting in ${delay}ms (Attempt ${
                reconnectCountRef.current + 1
              })`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectCountRef.current += 1;
              connect();
            }, delay);
          }
        };

        socketRef.current = socket;
      } catch (err: any) {
        // Ignore errors caused by component unmounting (AbortController)
        if (err.name === "CanceledError" || err.name === "AbortError") return;

        console.error("[WebSocket] Ticket/Connection failed:", err);
        setIsConnected(false);
      }
    },
    [roomId, auctionId, api, queryClient]
  );

  const sendMessage = useCallback((type: AuctionMessageType, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("[WebSocket] Cannot send: Connection not open");
    }
  }, []);

  useEffect(() => {
    // We use an AbortController to handle React Strict Mode & fast navigation.
    // If the component unmounts before the 'api.post' returns, the request is cancelled.
    const abortController = new AbortController();

    connect(abortController);

    return () => {
      abortController.abort();
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // const getBids = useCallback((auctionId: string) => {
  //   if (!socketRef.current) return;
  //   socketRef.current.send(JSON.stringify({ type: "get_bids", payload: { auctionId } }));
  // }, []);

  return {
    isConnected,
    messages,
    lastMessage,
    sendMessage,
    reconnect: () => {
      reconnectCountRef.current = 0;
      connect();
    },
  };
};
