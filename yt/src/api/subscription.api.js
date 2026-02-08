import api from "./axios";

// toggle subscription
export const toggleSubscription = (channelId) =>
  api.post(`/subscriptions/toggle/${channelId}`);

// get channel subscribers
export const getChannelSubscribers = (channelId) =>
  api.get(`/subscriptions/channel/${channelId}`);

// get subscribed channels
export const getSubscribedChannels = (userId) =>
  api.get(`/subscriptions/user/${userId}`);
