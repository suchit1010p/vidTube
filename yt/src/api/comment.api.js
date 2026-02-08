import api from "./axios";

// get comments by video
export const getCommentsByVideo = (videoId) =>
  api.get(`/comments/${videoId}`);

// add comment
export const addComment = (videoId, data) =>
  api.post(`/comments/${videoId}`, data);

// update comment
export const updateComment = (commentId, data) =>
  api.patch(`/comments/${commentId}`, data);

// delete comment
export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
