import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as playlistApi from "../../api/playlist.api";

export const fetchUserPlaylists = createAsyncThunk(
  "playlist/fetchUserPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await playlistApi.getUserPlaylists();
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlists"
      );
    }
  }
);

export const fetchPlaylistById = createAsyncThunk(
  "playlist/fetchPlaylistById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await playlistApi.getPlaylistById(playlistId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch playlist"
      );
    }
  }
);

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await playlistApi.createPlaylist(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create playlist"
      );
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await playlistApi.addVideoToPlaylist(playlistId, videoId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add video to playlist"
      );
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const response = await playlistApi.removeVideoFromPlaylist(playlistId, videoId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove video from playlist"
      );
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      await playlistApi.deletePlaylist(playlistId);
      return playlistId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete playlist"
      );
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async ({ playlistId, data }, { rejectWithValue }) => {
    try {
      const response = await playlistApi.updatePlaylist(playlistId, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update playlist"
      );
    }
  }
);

const initialState = {
  playlists: [],
  currentPlaylist: null,
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserPlaylists
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPlaylistById
      .addCase(fetchPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylist = action.payload;
      })
      .addCase(fetchPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentPlaylist = null;
      })

      // createPlaylist
      .addCase(createPlaylist.fulfilled, (state, action) => {
        if (action.payload) {
          state.playlists.unshift(action.payload);
        }
      })

      // addVideoToPlaylist
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const index = state.playlists.findIndex((p) => p._id === updated._id);
          if (index !== -1) state.playlists[index] = updated;
          if (state.currentPlaylist?._id === updated._id) state.currentPlaylist = updated;
        }
      })

      // removeVideoFromPlaylist
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const index = state.playlists.findIndex((p) => p._id === updated._id);
          if (index !== -1) state.playlists[index] = updated;
          if (state.currentPlaylist?._id === updated._id) state.currentPlaylist = updated;
        }
      })

      // deletePlaylist
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.playlists = state.playlists.filter((p) => p._id !== action.payload);
        if (state.currentPlaylist?._id === action.payload) {
          state.currentPlaylist = null;
        }
      });
  },
});

export const { clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
