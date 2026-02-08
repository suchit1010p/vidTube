import api from "./axios";

// get all videos
export const getAllVideos = (params) =>
  api.get("/videos", { params });

// get video by id
export const getVideoById = (videoId) =>
  api.get(`/videos/${videoId}`);

// publish video
export const publishVideo = (formData) =>
  api.post("/videos/publishVideo", formData);

// update video
export const updateVideo = (videoId, data) =>
  api.patch(`/videos/${videoId}`, data);

// delete video
export const deleteVideo = (videoId) =>
  api.delete(`/videos/${videoId}`);
