import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideos,
} from "../../api/like.api";

/* =========================
   TOGGLE VIDEO LIKE
========================= */
export const useToggleVideoLike = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleVideoLike(videoId),
    onSuccess: () => {
      // refresh video data (likes count, isLiked)
      queryClient.invalidateQueries({
        queryKey: ["video", videoId],
      });

      // refresh liked videos list
      queryClient.invalidateQueries({
        queryKey: ["likes", "videos"],
      });
    },
  });
};

/* =========================
   TOGGLE COMMENT LIKE
========================= */
export const useToggleCommentLike = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => toggleCommentLike(commentId),
    onSuccess: () => {
      // refresh comments (like count / state)
      queryClient.invalidateQueries({
        queryKey: ["comments", videoId],
      });
    },
  });
};

/* =========================
   GET LIKED VIDEOS
========================= */
export const useLikedVideos = (params = {}) => {
  return useQuery({
    queryKey: ["likes", "videos", params],
    queryFn: () => getLikedVideos(params),
    select: (res) => res.data.data,
  });
};

