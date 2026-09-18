import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeAuth } from "../store/slices/authSlice";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

// Pages
import Home from "../pages/Home";
import Video from "../pages/Video";
import Channel from "../pages/Channel";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PublishVideo from "../pages/PublishVideo";
import Dashboard from "../pages/Dashboard";
import Playlists from "../pages/Playlists";
import PlaylistDetails from "../pages/PlaylistDetails";
import History from "../pages/History";
import LikedVideos from "../pages/LikedVideos";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Proactively initialize authentication session on application load
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES (NO LAYOUT) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PUBLIC CONTENT ROUTES (WITH LAYOUT) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<Video />} />
        <Route path="/channel/:username" element={<Channel />} />

        {/* PROTECTED CONTENT ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/publish-video" element={<PublishVideo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
          <Route path="/history" element={<History />} />
          <Route path="/liked-videos" element={<LikedVideos />} />
        </Route>
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
