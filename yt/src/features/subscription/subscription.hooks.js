import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleSubscription,
  getChannelSubscribers,
  getSubscribedChannels,
} from "../../api/subscription.api";

/* =========================
   TOGGLE SUBSCRIPTION
========================= */
export const useToggleSubscription = (channelId, username) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSubscription(channelId),
    onSuccess: () => {
      // refresh channel subscribers
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "channel", channelId],
      });

      // refresh channel profile (isSubscribed, counts)
      if (username) {
        queryClient.invalidateQueries({
          queryKey: ["auth", "channel", username],
        });
      }
    },
  });
};

/* =========================
   GET CHANNEL SUBSCRIBERS
========================= */
export const useChannelSubscribers = (channelId) => {
  return useQuery({
    queryKey: ["subscriptions", "channel", channelId],
    queryFn: () => getChannelSubscribers(channelId),
    enabled: !!channelId,
    select: (res) => res.data.data,
  });
};

/* =========================
   GET SUBSCRIBED CHANNELS (USER)
========================= */
export const useSubscribedChannels = (userId) => {
  return useQuery({
    queryKey: ["subscriptions", "user", userId],
    queryFn: () => getSubscribedChannels(userId),
    enabled: !!userId,
    select: (res) => res.data.data,
  });
};
