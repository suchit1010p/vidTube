import api from "./axios";

// create playlist
export const createPlaylist = (data) =>
  api.post("/playlists", data);

// get user playlists
export const getUserPlaylists = () =>
  api.get("/playlists");

// get playlist by id
export const getPlaylistById = (playlistId) =>
  api.get(`/playlists/${playlistId}`);

// add video to playlist
export const addVideoToPlaylist = (playlistId, videoId) =>
  api.post(`/playlists/${playlistId}/videos/${videoId}`);

// remove video from playlist
export const removeVideoFromPlaylist = (playlistId, videoId) =>
  api.delete(`/playlists/${playlistId}/videos/${videoId}`);

// update playlist
export const updatePlaylist = (playlistId, data) =>
  api.patch(`/playlists/${playlistId}`, data);

// delete playlist
export const deletePlaylist = (playlistId) =>
  api.delete(`/playlists/${playlistId}`);
