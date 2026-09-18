import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as channelApi from "../../api/channel.api";

export const fetchChannelProfile = createAsyncThunk(
  "channel/fetchChannelProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await channelApi.getChannelProfile(username);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch channel profile"
      );
    }
  }
);

const initialState = {
  channel: null,
  loading: false,
  error: null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    clearChannel: (state) => {
      state.channel = null;
    },
    updateChannelSubscription: (state, action) => {
      if (state.channel) {
        state.channel.isSubscribed = action.payload.isSubscribed;
        state.channel.subscribersCount = action.payload.isSubscribed
          ? (state.channel.subscribersCount || 0) + 1
          : Math.max((state.channel.subscribersCount || 1) - 1, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.channel = action.payload;
      })
      .addCase(fetchChannelProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.channel = null;
      });
  },
});

export const { clearChannel, updateChannelSubscription } = channelSlice.actions;
export default channelSlice.reducer;
