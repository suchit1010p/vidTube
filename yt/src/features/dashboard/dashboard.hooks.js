import { useQuery } from "@tanstack/react-query";
import { getChannelStats } from "../../api/dashboard.api";

/* =========================
   GET CHANNEL STATS
========================= */
export const useChannelStats = () => {
  return useQuery({
    queryKey: ["dashboard", "channelStats"],
    queryFn: getChannelStats,
    select: (res) => res.data.data,
  });
};
