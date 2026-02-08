import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChannelProfile,
  toggleSubscription
} from "../../api/channel.api.js";

// Channel profile
export const useChannelProfile = (username) => {
  return useQuery({
    queryKey: ["channel", username],
    queryFn: () => getChannelProfile(username),
    enabled: !!username,
    select: (res) => res.data.data
  });
};



// Toggle subscribe
export const useToggleSubscription = (channelId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSubscription(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries(["channel"]);
    }
  });
};
