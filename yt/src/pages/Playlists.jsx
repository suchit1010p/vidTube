import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPlaylists } from "../store/slices/playlistSlice";
import CreatePlaylistModal from "../features/playlist/CreatePlaylistModal";
import { FaPlus } from "react-icons/fa";
import "./styles/playlists.css";
import "../features/playlist/create-playlist.css";

const Playlists = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { playlists, loading, error } = useSelector((state) => state.playlist);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPlaylists());
  }, [dispatch]);

  if (loading && (!playlists || playlists.length === 0)) {
    return (
      <div className="playlists-loading" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Loading playlists...</h2>
      </div>
    );
  }

  return (
    <div className="playlists-page">
      <div className="playlists-header-row">
        <h2>Your Playlists</h2>
        <button
          className="create-playlist-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Create Playlist
        </button>
      </div>

      {error && (
        <div style={{ color: "#e74c3c", margin: "16px 0" }}>{error}</div>
      )}

      {(!playlists || playlists.length === 0) && (
        <div className="no-playlists">
          <p>You haven’t created any playlists yet.</p>
          <button onClick={() => setShowCreateModal(true)}>Create One Now</button>
        </div>
      )}

      <div className="playlists-grid">
        {playlists.map((playlist) => {
          const latestVideo =
            playlist.videos?.[playlist.videos.length - 1];

          return (
            <div
              key={playlist._id}
              className="playlist-card"
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              title={playlist.name}
            >
              <div className="playlist-thumb-wrapper">
                <div className="playlist-shadow shadow-1" />
                <div className="playlist-shadow shadow-2" />

                <div className="playlist-thumb">
                  {latestVideo && (latestVideo.thumbnail || typeof latestVideo === "object") ? (
                    <img
                      src={latestVideo.thumbnail || "https://via.placeholder.com/320x180"}
                      alt={playlist.name}
                    />
                  ) : (
                    <div className="empty-thumb">No videos</div>
                  )}

                  {playlist.videos?.length > 0 && (
                    <span className="playlist-count">
                      {playlist.videos.length} videos
                    </span>
                  )}
                </div>
              </div>

              <div className="playlist-info">
                <h4>{playlist.name}</h4>
                <p>{playlist.videos?.length || 0} videos</p>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => {
            setShowCreateModal(false);
            dispatch(fetchUserPlaylists());
          }}
        />
      )}
    </div>
  );
};

export default Playlists;
