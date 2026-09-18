import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as subscriptionApi from "../../api/subscription.api";
import { updateChannelSubscription } from "./channelSlice";

export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (channelId, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await subscriptionApi.toggleSubscription(channelId);
      const isSubscribed = response.data.data?.isSubscribed;

      // Also update channel slice if current channel matches
      const currentChannel = getState().channel.channel;
      if (currentChannel && currentChannel._id === channelId) {
        dispatch(updateChannelSubscription({ isSubscribed }));
      }

      return { channelId, isSubscribed };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle subscription"
      );
    }
  }
);

export const fetchChannelSubscribers = createAsyncThunk(
  "subscription/fetchChannelSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getChannelSubscribers(channelId);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscribers"
      );
    }
  }
);

export const fetchSubscribedChannels = createAsyncThunk(
  "subscription/fetchSubscribedChannels",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getSubscribedChannels(userId);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscribed channels"
      );
    }
  }
);

const initialState = {
  subscribers: [],
  subscribedChannels: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelSubscribers.fulfilled, (state, action) => {
        state.subscribers = action.payload;
      })
      .addCase(fetchSubscribedChannels.fulfilled, (state, action) => {
        state.subscribedChannels = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
