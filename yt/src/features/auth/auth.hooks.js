import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccount,
  changePassword,
  updateAvatar,
  updateCoverImage,
  getChannelProfile,
  getWatchHistory,
  refreshToken,
} from "../../api/auth.api";
import { authStorage } from "../../utils/authStorage";

// Query Keys - Centralized for consistency
export const authKeys = {
  currentUser: ["auth", "currentUser"],
  channel: (username) => ["auth", "channel", username],
  watchHistory: ["auth", "watchHistory"],
};

/* =========================
   GET CURRENT USER
========================= */
export const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false, // CRITICAL: Don't retry on auth failures - instant redirect
    staleTime: 10 * 60 * 1000, // 10 minutes - reduce API calls
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchOnWindowFocus: false, // Don't refetch when tab regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    select: (res) => res.data.data,
    ...options,
  });
};

/* =========================
   REGISTER
========================= */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      // Normalize response data structure
      const userData = response.data.data;
      const user = userData.user || userData;
      const accessToken = userData.accessToken || response.data.data.accessToken;

      // Update storage FIRST - instant access for next checks
      authStorage.setUser(user);
      if (accessToken) {
        authStorage.setAccessToken(accessToken);
      }

      // Update query cache
      queryClient.setQueryData(authKeys.currentUser, {
        data: { data: user }
      });
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      authStorage.clearAuth();
      queryClient.setQueryData(authKeys.currentUser, null);
    },
  });
};

/* =========================
   LOGIN
========================= */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data;

      // Update storage FIRST - critical for instant redirects
      authStorage.setUser(user);
      authStorage.setAccessToken(accessToken);

      // Update query cache
      queryClient.setQueryData(authKeys.currentUser, {
        data: { data: user }
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      authStorage.clearAuth();
      queryClient.setQueryData(authKeys.currentUser, null);
    },
  });
};

/* =========================
   LOGOUT
========================= */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear storage FIRST
      authStorage.clearAuth();

      // Clear queries
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.removeQueries({ queryKey: ["auth"] });

      // Clear other user-specific data
      queryClient.removeQueries({ queryKey: ["videos"] });
      queryClient.removeQueries({ queryKey: ["playlists"] });
      queryClient.removeQueries({ queryKey: ["likes"] });
      queryClient.removeQueries({ queryKey: ["comments"] });
      queryClient.removeQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      // Even if logout fails on server, clear local state
      console.error("Logout failed on server, clearing local state:", error);
      authStorage.clearAuth();
      queryClient.clear(); // Clear everything on error
    },
  });
};

/* =========================
   UPDATE ACCOUNT DETAILS
========================= */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: authKeys.currentUser });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(authKeys.currentUser);

      // Optimistically update
      if (previousUser) {
        const updatedUser = {
          ...previousUser,
          data: {
            ...previousUser.data,
            data: {
              ...previousUser.data.data,
              ...newData
            }
          }
        };

        queryClient.setQueryData(authKeys.currentUser, updatedUser);

        // Update localStorage too
        authStorage.setUser({
          ...previousUser.data.data,
          ...newData
        });
      }

      return { previousUser };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(authKeys.currentUser, context.previousUser);
        authStorage.setUser(context.previousUser.data.data);
      }
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "channelStats"] });
    },
  });
};

/* =========================
   CHANGE PASSWORD
========================= */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    // No cache updates needed for password change
  });
};

/* =========================
   UPDATE AVATAR
========================= */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (response) => {
      const newAvatar = response.data.data.avatar;

      // Update cache
      queryClient.setQueryData(authKeys.currentUser, (old) => {
        if (!old) return old;
        const updated = {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              avatar: newAvatar
            }
          }
        };

        // Update localStorage
        authStorage.setUser(updated.data.data);
        return updated;
      });

      // Update dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboard", "channelStats"] });
    },
  });
};

/* =========================
   UPDATE COVER IMAGE
========================= */
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCoverImage,
    onSuccess: (response) => {
      const newCoverImage = response.data.data.coverImage;

      // Update cache
      queryClient.setQueryData(authKeys.currentUser, (old) => {
        if (!old) return old;
        const updated = {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              coverImage: newCoverImage
            }
          }
        };

        // Update localStorage
        authStorage.setUser(updated.data.data);
        return updated;
      });

      // Update dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboard", "channelStats"] });
    },
  });
};

/* =========================
   CHANNEL PROFILE
========================= */
export const useChannelProfile = (username) => {
  return useQuery({
    queryKey: authKeys.channel(username),
    queryFn: () => getChannelProfile(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (res) => res.data.data,
  });
};

/* =========================
   WATCH HISTORY
========================= */
export const useRefreshSession = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["auth", "refreshSession"],
    queryFn: async () => {
      try {
        const response = await refreshToken();
        const { user, accessToken } = response.data.data;

        // Update storage
        authStorage.setUser(user);
        authStorage.setAccessToken(accessToken);

        // Update query cache
        queryClient.setQueryData(authKeys.currentUser, {
          data: { data: user }
        });

        return user;
      } catch (error) {
        // If refresh fails (e.g. no cookie), that's fine, just clear auth
        authStorage.clearAuth();
        queryClient.setQueryData(authKeys.currentUser, null);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Run on mount
    staleTime: 10 * 60 * 1000,
  });
};


export const useWatchHistory = () => {
  return useQuery({
    queryKey: authKeys.watchHistory,
    queryFn: getWatchHistory,
    enabled: !!authStorage.getAccessToken(),
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data.data,
  });
};