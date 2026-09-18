import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as videoApi from "../../api/video.api";

export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await videoApi.getAllVideos(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch videos"
      );
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  "video/fetchVideoById",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoApi.getVideoById(videoId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch video"
      );
    }
  }
);

export const publishVideo = createAsyncThunk(
  "video/publishVideo",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await videoApi.publishVideo(formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload video"
      );
    }
  }
);

export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async ({ videoId, data }, { rejectWithValue }) => {
    try {
      const response = await videoApi.updateVideo(videoId, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update video"
      );
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      await videoApi.deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete video"
      );
    }
  }
);

const initialState = {
  videos: [],
  totalVideos: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  hasNextPage: false,
  currentVideo: null,
  loading: false,
  detailLoading: false,
  uploadLoading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    updateCurrentVideoLike: (state, action) => {
      if (state.currentVideo) {
        state.currentVideo.isLiked = action.payload.isLiked;
        state.currentVideo.totalLikes = action.payload.totalLikes;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchVideos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.videos = payload.videos || [];
        state.totalVideos = payload.totalVideos || 0;
        state.totalPages = payload.totalPages || 1;
        state.currentPage = payload.currentPage || 1;
        state.limit = payload.limit || 10;
        state.hasNextPage = payload.hasNextPage || false;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchVideoById
      .addCase(fetchVideoById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
        state.currentVideo = null;
      })

      // publishVideo
      .addCase(publishVideo.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.uploadLoading = false;
        if (action.payload) {
          state.videos.unshift(action.payload);
        }
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })

      // deleteVideo
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v._id !== action.payload);
        if (state.currentVideo?._id === action.payload) {
          state.currentVideo = null;
        }
      });
  },
});

export const { clearCurrentVideo, updateCurrentVideoLike } = videoSlice.actions;
export default videoSlice.reducer;
