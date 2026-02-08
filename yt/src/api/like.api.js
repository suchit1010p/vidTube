import api from "./axios";

// toggle video like
export const toggleVideoLike = (videoId) =>
  api.post(`/likes/video/${videoId}`);

// toggle comment like
export const toggleCommentLike = (commentId) =>
  api.post(`/likes/comment/${commentId}`);

// get liked videos
export const getLikedVideos = (params) =>
  api.get("/likes/videos", { params });
