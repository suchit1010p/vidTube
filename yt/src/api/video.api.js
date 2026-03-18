import api from "./axios";

// get all videos
export const getAllVideos = (params = {}) => {
  const { page, pages, ...restParams } = params;
  const resolvedPage = Number(pages ?? page ?? 1) || 1;

  return api.get("/videos", {
    params: {
      ...restParams,
      page: resolvedPage,
      pages: resolvedPage,
    },
  });
};

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
