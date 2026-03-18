import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllVideos,
  getVideoById,
  publishVideo,
  updateVideo,
  deleteVideo,
} from "../../api/video.api";

/* =========================
   GET ALL VIDEOS (HOME / SEARCH)
========================= */
export const useAllVideos = (params = {}) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => getAllVideos(params),
    keepPreviousData: true, // important for pagination
    select: (res) => {
      const payload = res.data?.data ?? {};
      const currentPage = payload.currentPage ?? payload.page ?? 1;
      const totalPages = payload.totalPages ?? 1;

      return {
        videos: payload.videos ?? [],
        totalVideos: payload.totalVideos ?? 0,
        totalPages,
        currentPage,
        limit: payload.limit ?? params.limit ?? 10,
        hasNextPage: payload.hasNextPage ?? currentPage < totalPages,
      };
    },
  });
};

/* =========================
   GET VIDEO BY ID (VIDEO PAGE)
========================= */
export const useVideoById = (videoId) => {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoById(videoId),
    enabled: !!videoId,
    select: (res) => res.data.data[0],
  });
};

/* =========================
   PUBLISH VIDEO
========================= */
export const usePublishVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishVideo,
    onSuccess: () => {
      // refresh home feed after upload
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });
};

/* =========================
   UPDATE VIDEO
========================= */
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, data }) => updateVideo(videoId, data),
    onSuccess: (_, variables) => {
      // refresh updated video
      queryClient.invalidateQueries({
        queryKey: ["video", variables.videoId],
      });

      // refresh video list
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });
};

/* =========================
   DELETE VIDEO
========================= */
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      // refresh all video lists
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
      // refresh dashboard stats
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "channelStats"],
      });
    },
  });
};
