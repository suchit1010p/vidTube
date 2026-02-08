import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../../api/playlist.api";

/* =========================
   GET USER PLAYLISTS
========================= */
export const useUserPlaylists = () => {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: getUserPlaylists,
    select: (res) => res.data.data,
  });
};

/* =========================
   GET PLAYLIST BY ID
========================= */
export const usePlaylistById = (playlistId) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistById(playlistId),
    enabled: !!playlistId,
    select: (res) => res.data.data,
  });
};

/* =========================
   CREATE PLAYLIST
========================= */
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
      });
    },
  });
};

/* =========================
   ADD VIDEO TO PLAYLIST
========================= */
export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, videoId }) =>
      addVideoToPlaylist(playlistId, videoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
      });
    },
  });
};

/* =========================
   REMOVE VIDEO FROM PLAYLIST
========================= */
export const useRemoveVideoFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, videoId }) =>
      removeVideoFromPlaylist(playlistId, videoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
      });
    },
  });
};

/* =========================
   UPDATE PLAYLIST
========================= */
export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, data }) =>
      updatePlaylist(playlistId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
      });
    },
  });
};

/* =========================
   DELETE PLAYLIST
========================= */
export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists"],
      });
    },
  });
};
