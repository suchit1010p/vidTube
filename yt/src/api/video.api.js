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

// publish video with real upload progress tracking
export const publishVideo = (formData, onUploadProgress) =>
  api.post("/videos/publishVideo", formData, {
    onUploadProgress,
    timeout: 0, // Disable timeout for video uploads so large files & Cloudinary encoding don't abort
  });

// update video
export const updateVideo = (videoId, data) =>
  api.patch(`/videos/${videoId}`, data);

// delete video
export const deleteVideo = (videoId) =>
  api.delete(`/videos/${videoId}`);
