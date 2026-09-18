import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as videoApi from "../../api/video.api";

// Initial video fetch (resets video list and pagination/cursor)
export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await videoApi.getAllVideos({
        ...params,
        page: 1,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch videos"
      );
    }
  }
);

// Infinite scroll fetch (appends next batch with deduplication)
export const fetchMoreVideos = createAsyncThunk(
  "video/fetchMoreVideos",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().video;
      // Guard against duplicate fetching if already fetching or at the end
      if (state.loadingMore || !state.hasNextPage) {
        return null;
      }
      const pageToFetch = params.page || state.nextPage || state.currentPage + 1;
      const response = await videoApi.getAllVideos({
        ...params,
        page: pageToFetch,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch more videos"
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

// Real-time progress upload thunk
export const publishVideo = createAsyncThunk(
  "video/publishVideo",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUploadProgress(0));
      const response = await videoApi.publishVideo(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch(setUploadProgress(percent));
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to upload video"
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
  nextPage: 2,
  limit: 12,
  hasNextPage: false,
  currentVideo: null,
  loading: false,          // Initial load
  loadingMore: false,      // Infinite scrolling load
  error: null,
  loadMoreError: null,
  detailLoading: false,

  // Real upload progress state
  uploadLoading: false,
  uploadProgress: 0,       // 0 to 100
  uploadStatus: "idle",    // "idle" | "uploading" | "processing" | "success" | "failed"
  uploadError: null,
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
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
      if (action.payload >= 100) {
        state.uploadStatus = "processing";
      } else if (action.payload > 0) {
        state.uploadStatus = "uploading";
      }
    },
    resetUploadState: (state) => {
      state.uploadProgress = 0;
      state.uploadStatus = "idle";
      state.uploadError = null;
      state.uploadLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchVideos (Initial Batch)
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loadMoreError = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.videos = payload.videos || [];
        state.totalVideos = payload.totalVideos || 0;
        state.totalPages = payload.totalPages || 1;
        state.currentPage = payload.currentPage || 1;
        state.limit = payload.limit || 12;
        state.hasNextPage = payload.hasMore ?? payload.hasNextPage ?? false;
        state.nextPage = state.hasNextPage ? state.currentPage + 1 : null;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchMoreVideos (Incremental Infinite Scroll Batch)
      .addCase(fetchMoreVideos.pending, (state) => {
        state.loadingMore = true;
        state.loadMoreError = null;
      })
      .addCase(fetchMoreVideos.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (!action.payload) return;

        const payload = action.payload;
        const newVideos = payload.videos || [];

        // Deduplicate incoming videos by _id to prevent duplicate keys
        const existingIds = new Set(state.videos.map((v) => v._id));
        const uniqueNewVideos = newVideos.filter((v) => !existingIds.has(v._id));
        state.videos = [...state.videos, ...uniqueNewVideos];

        state.totalVideos = payload.totalVideos || state.totalVideos;
        state.totalPages = payload.totalPages || state.totalPages;
        state.currentPage = payload.currentPage || (state.currentPage + 1);
        state.hasNextPage = payload.hasMore ?? payload.hasNextPage ?? false;
        state.nextPage = state.hasNextPage ? state.currentPage + 1 : null;
      })
      .addCase(fetchMoreVideos.rejected, (state, action) => {
        state.loadingMore = false;
        state.loadMoreError = action.payload;
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

      // publishVideo (With Real-Time Upload Progress)
      .addCase(publishVideo.pending, (state) => {
        state.uploadLoading = true;
        state.uploadStatus = "uploading";
        state.uploadProgress = 0;
        state.uploadError = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadStatus = "success";
        state.uploadProgress = 100;
        state.uploadError = null;
        if (action.payload) {
          state.videos.unshift(action.payload);
          state.totalVideos += 1;
        }
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadStatus = "failed";
        state.uploadError = action.payload;
      })

      // deleteVideo
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v._id !== action.payload);
        if (state.currentVideo?._id === action.payload) {
          state.currentVideo = null;
        }
        state.totalVideos = Math.max((state.totalVideos || 1) - 1, 0);
      });
  },
});

export const {
  clearCurrentVideo,
  updateCurrentVideoLike,
  setUploadProgress,
  resetUploadState,
} = videoSlice.actions;

export default videoSlice.reducer;
