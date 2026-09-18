import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPlaylists } from "../store/slices/playlistSlice";
import CreatePlaylistModal from "../features/playlist/CreatePlaylistModal";
import EmptyState from "../components/common/EmptyState";
import { FaPlus, FaList, FaPlay } from "react-icons/fa";
import "./styles/playlists.css";

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
      <div className="pl-container">
        <div className="skeleton" style={{ height: "40px", width: "240px", marginBottom: "24px" }} />
        <div className="pl-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "240px", borderRadius: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pl-container animate-fade-in">
      {/* HEADER ROW */}
      <div className="pl-header">
        <div>
          <h1 className="pl-title">Your Playlists</h1>
          <p className="pl-subtitle">Manage and organize your curated collections</p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus />
          <span>New Playlist</span>
        </button>
      </div>

      {error && (
        <div className="pv-error-alert" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {(!playlists || playlists.length === 0) ? (
        <EmptyState
          icon={<FaList />}
          title="No playlists created yet"
          description="Group your favorite videos together to watch or share later."
          actionText="Create Playlist"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="pl-grid">
          {playlists.map((playlist) => {
            const firstVideo = playlist.videos?.[0];
            const coverThumb =
              firstVideo?.thumbnail ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&q=80";

            return (
              <div
                key={playlist._id}
                className="pl-card"
                onClick={() => navigate(`/playlists/${playlist._id}`)}
              >
                {/* STACKED CARD VISUAL EFFECT */}
                <div className="pl-card-stack">
                  <div className="pl-stack-layer-2" />
                  <div className="pl-stack-layer-1" />

                  <div className="pl-thumb-wrapper">
                    <img
                      src={coverThumb}
                      alt={playlist.name}
                      className="pl-thumb-img"
                    />
                    <div className="pl-thumb-overlay">
                      <FaPlay size={18} />
                    </div>
                    <span className="pl-count-badge">
                      {playlist.videos?.length || 0} videos
                    </span>
                  </div>
                </div>

                <div className="pl-card-meta">
                  <h3 className="pl-card-title">{playlist.name}</h3>
                  <span className="pl-card-sub">
                    {playlist.videos?.length || 0} {playlist.videos?.length === 1 ? "video" : "videos"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
