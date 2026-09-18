import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as commentApi from "../../api/comment.api";
import * as likeApi from "../../api/like.api";

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await commentApi.getCommentsByVideo(videoId);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await commentApi.addComment(videoId, { content });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentApi.updateComment(commentId, { content });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await commentApi.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "comment/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await likeApi.toggleCommentLike(commentId);
      return { commentId, isLiked: response.data.data?.isLiked };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like comment"
      );
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  submitting: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addComment
      .addCase(addComment.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload) {
          state.comments.unshift(action.payload);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // updateComment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const index = state.comments.findIndex((c) => c._id === updated._id);
          if (index !== -1) {
            state.comments[index] = { ...state.comments[index], ...updated };
          }
        }
      })

      // deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })

      // toggleCommentLike
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, isLiked } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.isLiked = isLiked;
          comment.likesCount = isLiked
            ? (comment.likesCount || 0) + 1
            : Math.max((comment.likesCount || 1) - 1, 0);
        }
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
