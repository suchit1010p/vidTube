import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/auth.api";

export const fetchWatchHistory = createAsyncThunk(
  "history/fetchWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getWatchHistory();
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch watch history"
      );
    }
  }
);

const initialState = {
  history: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
