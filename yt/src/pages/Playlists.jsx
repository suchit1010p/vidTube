import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPlaylists } from "../features/playlist/playlist.hooks";
import CreatePlaylistModal from "../features/playlist/CreatePlaylistModal";
import { FaPlus } from "react-icons/fa";
import "./styles/playlists.css";
import "../features/playlist/create-playlist.css";

const Playlists = () => {
  const navigate = useNavigate();
  const { data: playlists = [], isLoading } = useUserPlaylists();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) return <div className="playlists-loading">Loading playlists...</div>;

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

      {playlists.length === 0 && (
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
              {/* THUMBNAIL WITH SUBTLE STACK */}
              <div className="playlist-thumb-wrapper">
                <div className="playlist-shadow shadow-1" />
                <div className="playlist-shadow shadow-2" />

                <div className="playlist-thumb">
                  {latestVideo ? (
                    <img
                      src={latestVideo.thumbnail}
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

              {/* INFO */}
              <div className="playlist-info">
                <h4>{playlist.name}</h4>
                <p>{playlist.videos?.length || 0} videos</p>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreatePlaylistModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Playlists;
