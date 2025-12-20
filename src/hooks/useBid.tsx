import useApiStore from "@/store/apistore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/notificationStore";

interface PlaceBidParams {
  auctionId: string;
  amount: number;
}

export const useBid = () => {
  const { api } = useApiStore();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationKey: ["placeBid"],
    mutationFn: async ({ auctionId, amount }: PlaceBidParams) => {
      const res = await api.post(`/auctions/${auctionId}/bid`, { amount });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the auction query to refresh the UI with new price
      queryClient.invalidateQueries({
        queryKey: ["auction", variables.auctionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["auction", variables.auctionId, "bids"],
      });

      addNotification({
        title: "Bid Placed",
        message: "Your bid has been successfully placed!",
        type: "info",
        variant: "toast",
      });
    },

    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to place bid";
      addNotification({
        title: "Bid Failed",
        message: errorMessage,
        type: "error",
        variant: "toast",
      });
    },
  });
};

export const useGetBids = (auctionId: string) => {
  const { api } = useApiStore();

  return useQuery({
    queryKey: ["auction", auctionId, "bids"],
    queryFn: async () => {
      const res = await api.get(`/auctions/${auctionId}/bids`);
      if (res.status != 200) {
        throw new Error("Failed to get bids");
      }
      console.log(res.data.data);
      return res.data.data;
    },
  });
};
