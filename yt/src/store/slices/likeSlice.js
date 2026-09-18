import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as likeApi from "../../api/like.api";
import { updateCurrentVideoLike } from "./videoSlice";

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await likeApi.toggleVideoLike(videoId);
      const isLiked = response.data.data?.isLiked;

      // Update currentVideo in videoSlice if it matches
      const currentVideo = getState().video.currentVideo;
      if (currentVideo && currentVideo._id === videoId) {
        const totalLikes = isLiked
          ? (currentVideo.totalLikes || 0) + 1
          : Math.max((currentVideo.totalLikes || 1) - 1, 0);
        dispatch(updateCurrentVideoLike({ isLiked, totalLikes }));
      }

      return { videoId, isLiked };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like video"
      );
    }
  }
);

export const fetchLikedVideos = createAsyncThunk(
  "like/fetchLikedVideos",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await likeApi.getLikedVideos(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch liked videos"
      );
    }
  }
);

const initialState = {
  likedVideos: [],
  totalLikes: 0,
  loading: false,
  error: null,
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchLikedVideos
      .addCase(fetchLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.likedVideos = payload.videos || [];
        state.totalLikes = payload.totalLikes || 0;
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
