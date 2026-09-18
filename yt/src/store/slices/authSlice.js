import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/auth.api";
import { authStorage } from "../../utils/authStorage";

// Initialize auth state on app startup
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const storedToken = authStorage.getAccessToken();
      if (!storedToken) {
        // Try refreshing using httpOnly refresh token cookie
        try {
          const refreshRes = await authApi.refreshToken();
          const { user, accessToken } = refreshRes.data.data;
          authStorage.setUser(user);
          authStorage.setAccessToken(accessToken);
          return { user, accessToken };
        } catch {
          authStorage.clearAuth();
          return null;
        }
      }

      // If token exists, verify current user
      const response = await authApi.getCurrentUser();
      const user = response.data.data;
      authStorage.setUser(user);
      return { user, accessToken: storedToken };
    } catch (error) {
      // Try refresh fallback
      try {
        const refreshRes = await authApi.refreshToken();
        const { user, accessToken } = refreshRes.data.data;
        authStorage.setUser(user);
        authStorage.setAccessToken(accessToken);
        return { user, accessToken };
      } catch {
        authStorage.clearAuth();
        return rejectWithValue(error.response?.data?.message || "Session expired");
      }
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.loginUser(credentials);
      const { user, accessToken } = response.data.data;
      authStorage.setUser(user);
      authStorage.setAccessToken(accessToken);
      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authApi.registerUser(formData);
      const { user, accessToken } = response.data.data;
      if (user) authStorage.setUser(user);
      if (accessToken) authStorage.setAccessToken(accessToken);
      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutUser();
      authStorage.clearAuth();
      return null;
    } catch (error) {
      authStorage.clearAuth();
      return rejectWithValue(error.response?.data?.message || "Logout error");
    }
  }
);

export const updateAccount = createAsyncThunk(
  "auth/updateAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.updateAccount(data);
      const updatedUser = response.data.data;
      authStorage.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateAvatar(formData);
      const updatedUser = response.data.data;
      authStorage.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update avatar"
      );
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  "auth/updateCoverImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateCoverImage(formData);
      const updatedUser = response.data.data;
      authStorage.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cover image"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(passwords);
      return response.data.message || "Password changed successfully";
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

const initialState = {
  user: authStorage.getUser(),
  token: authStorage.getAccessToken(),
  isAuthenticated: !!authStorage.getAccessToken(),
  authLoading: true,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // initializeAuth
      .addCase(initializeAuth.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.authLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.authLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // updateAccount
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateAvatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // updateCoverImage
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
