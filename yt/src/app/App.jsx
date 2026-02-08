import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

// pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Video from "../pages/Video";
import Channel from "../pages/Channel";
import Playlists from "../pages/Playlists";
import PlaylistDetails from "../pages/PlaylistDetails";
import Dashboard from "../pages/Dashboard";
import History from "../pages/History";
import LikedVideos from "../pages/LikedVideos";
import PublishVideo from "../pages/PublishVideo";

import { useRefreshSession } from "../features/auth/auth.hooks";

const App = () => {
  // Proactively check for session on app load
  useRefreshSession();

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      {/* <Route element={<Layout />}> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* </Route> */}

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/video/:videoId" element={<Video />} />
          <Route path="/channel/:username" element={<Channel />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/liked-videos" element={<LikedVideos />} />
          <Route path="/publish-video" element={<PublishVideo />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default App;
