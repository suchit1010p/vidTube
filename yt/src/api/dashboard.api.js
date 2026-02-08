import api from "./axios";

// get channel stats
export const getChannelStats = () =>
  api.get("/dashboard");
