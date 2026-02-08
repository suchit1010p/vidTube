import api from "./axios";

export const getChannelProfile = (username) =>
  api.get(`/users/c/${username}`);

export const toggleSubscription = (channelId) =>
  api.post(`/subscriptions/toggle/${channelId}`);

