"use client";

import useApiStore from "@/store/apistore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "./product";

export interface Auction {
  id?: string;
  product_id?: string;
  min_increment: number;
  buy_now_price: number;
  buy_now: boolean;
  room_id: string;
  estimated_price: number;
  start_time: string;
  end_time: string;
  start_price: number;
  reserve_price?: number;
  current_bid?: number;
  status?: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  products?: {
    id: string;
    owner_id: string;
    slug?: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    images: string[];
    status: string;
  };
}

export const useCreateAuction = () => {
  const { api } = useApiStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auction"],
    mutationFn: async (auction: Auction) => {
      const res = await api.post(`/auctions/${auction.product_id}`, auction);
      if (res.status != 201) {
        throw new Error("Failed to create auction");
      }
      return res.data;
    },
    onSuccess(): void {
      queryClient.invalidateQueries({ queryKey: ["auction"] });
    },
  });
};

export const useListAuctions = (params: { limit: number; offset: number }) => {
  const { api } = useApiStore();

  return useQuery({
    queryKey: ["auction", params.limit, params.offset],
    queryFn: async () => {
      const res = await api.get("/auctions", {
        params: {
          limit: params.limit,
          offset: params.offset,
        },
      });
      if (res.status != 200) {
        throw new Error("Failed to get auctions");
      }
      return res.data;
    },
  });
};

export const useAuctionByID = (id: string) => {
  const { api } = useApiStore();

  return useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      const res = await api.get(`/auctions/${id}`);
      if (res.status != 200) {
        throw new Error("Failed to get auctions");
      }
      return res.data;
    },
    enabled: !!id,
  });
};

export const useSearchAuctions = (params: {
  limit?: number;
  offset?: number;
  q?: string;
}) => {
  const { api } = useApiStore();

  return useQuery<{ data: Auction[]; meta: any }>({
    queryKey: ["auction", "search", params],
    queryFn: async () => {
      const res = await api.get("/auctions/search", {
        params,
      });
      if (res.status != 200) {
        throw new Error("Failed to search auctions");
      }
      return res.data;
    },
    enabled: !!params.q,
  });
};

export const useFilterAuctions = (params: {
  limit?: number;
  offset?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  status?: string;
  sort_by?: string;
}) => {
  const { api } = useApiStore();

  return useQuery<{ data: Auction[]; meta: any }>({
    queryKey: ["auction", "filter", params],
    queryFn: async () => {
      // Remove undefined/null params to avoid sending empty strings
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
      );

      const res = await api.get("/auctions/filter", {
        params: cleanParams,
      });
      if (res.status != 200) {
        throw new Error("Failed to filter auctions");
      }
      return res.data;
    },
  });
};

export const useUserBids = () => {
  const { api } = useApiStore();

  return useQuery({
    queryKey: ["auction", "user-bids"],
    queryFn: async () => {
      const res = await api.get("/auctions/user/bids");
      if (res.status !== 200) {
        throw new Error("Failed to get user bids");
      }
      return res.data;
    },
  });
};

export const listRecommendations = (params: {
  limit?: number;
  offset?: number;
  category?: string;
  current_id?: string;
}) => {
  const { api } = useApiStore();

  return useQuery({
    queryKey: ["auction", "recommendations", params],
    queryFn: async () => {
      const res = await api.get("/products/auction/recommendations", {
        params,
      });
      if (res.status != 200) {
        throw new Error("Failed to get recommendations");
      }
      return res.data;
    },
  });
};

export const useAuctionStore = () => {
  return {
    createAuction: useCreateAuction,
    listAuctions: useListAuctions,
    listAuctionByID: useAuctionByID,
    searchAuctions: useSearchAuctions,
    listRecommendations: listRecommendations,
    useUserBids: useUserBids,
  };
};
