import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsByVideo,
  addComment,
  updateComment,
  deleteComment,
} from "../../api/comment.api";

/* =========================
   GET COMMENTS BY VIDEO
========================= */
export const useVideoComments = (videoId) => {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getCommentsByVideo(videoId),
    enabled: !!videoId,
    select: (res) => {
      if (Array.isArray(res.data.data)) return res.data.data;
      return [];
    },
  });
};


/* =========================
   ADD COMMENT
========================= */
export const useAddComment = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => addComment(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", videoId],
      });
    },
  });
};

/* =========================
   UPDATE COMMENT
========================= */
export const useUpdateComment = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }) => updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", videoId],
      });
    },
  });
};

/* =========================
   DELETE COMMENT
========================= */
export const useDeleteComment = (videoId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", videoId],
      });
    },
  });
};
