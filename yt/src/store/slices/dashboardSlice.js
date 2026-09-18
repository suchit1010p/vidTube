import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as dashboardApi from "../../api/dashboard.api";

export const fetchChannelStats = createAsyncThunk(
  "dashboard/fetchChannelStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getChannelStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    removeVideoFromDashboardStats: (state, action) => {
      if (state.stats && state.stats.videos) {
        state.stats.videos = state.stats.videos.filter(
          (v) => v._id !== action.payload
        );
        state.stats.totalVideos = Math.max((state.stats.totalVideos || 1) - 1, 0);
      }
    },
    updateDashboardAvatar: (state, action) => {
      if (state.stats) {
        state.stats.avatar = action.payload;
      }
    },
    updateDashboardCover: (state, action) => {
      if (state.stats) {
        state.stats.coverImage = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchChannelStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  removeVideoFromDashboardStats,
  updateDashboardAvatar,
  updateDashboardCover,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
