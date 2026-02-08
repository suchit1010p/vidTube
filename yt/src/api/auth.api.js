import api from "./axios";

// register
export const registerUser = (formData) =>
  api.post("/users/register", formData);

// login
export const loginUser = (data) =>
  api.post("/users/login", data);

// logout
export const logoutUser = () =>
  api.post("/users/logout");

// refresh token
export const refreshToken = () =>
  api.post("/users/refresh-token");

// current user
export const getCurrentUser = () =>
  api.get("/users/current-user");

// update account
export const updateAccount = (data) =>
  api.patch("/users/update-account", data);

// change password
export const changePassword = (data) =>
  api.post("/users/change-password", data);

// avatar
export const updateAvatar = (formData) =>
  api.patch("/users/avatar", formData);

// cover image
export const updateCoverImage = (formData) =>
  api.patch("/users/cover-image", formData);

// channel profile
export const getChannelProfile = (username) =>
  api.get(`/users/c/${username}`);

// watch history
export const getWatchHistory = () =>
  api.get("/users/history");
