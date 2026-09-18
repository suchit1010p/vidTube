import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../../store/slices/playlistSlice";
import { FaTimes, FaPlus } from "react-icons/fa";
import "./playlist.css";

const PlaylistModal = ({ videoId, onClose }) => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.playlist);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPlaylists());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsCreating(true);
    const resultAction = await dispatch(createPlaylist({ name: name.trim() }));
    setIsCreating(false);
    if (createPlaylist.fulfilled.match(resultAction)) {
      setName("");
      // Add video to new playlist immediately
      if (resultAction.payload?._id) {
        dispatch(
          addVideoToPlaylist({
            playlistId: resultAction.payload._id,
            videoId,
          })
        );
      }
    }
  };

  const toggleVideo = (playlist) => {
    const isAdded = (playlist.videos || []).some(
      (video) => (video._id || video) === videoId
    );

    if (isAdded) {
      dispatch(removeVideoFromPlaylist({ playlistId: playlist._id, videoId }));
    } else {
      dispatch(addVideoToPlaylist({ playlistId: playlist._id, videoId }));
    }
  };

  return (
    <div className="plm-backdrop" onClick={onClose}>
      <div className="plm-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="plm-header">
          <h3>Save to Playlist</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="plm-body">
          {loading && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading playlists...</p>}

          {!loading && (playlists || []).length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              You haven&rsquo;t created any playlists yet. Create one below!
            </p>
          )}

          <div className="plm-items-list">
            {!loading &&
              (playlists || []).map((playlist) => {
                const isAdded = (playlist.videos || []).some(
                  (video) => (video._id || video) === videoId
                );

                return (
                  <label key={playlist._id} className="plm-item-row">
                    <input
                      type="checkbox"
                      className="plm-checkbox"
                      checked={isAdded}
                      onChange={() => toggleVideo(playlist)}
                    />
                    <span className="plm-item-name">{playlist.name}</span>
                  </label>
                );
              })}
          </div>

          <div className="plm-create-box">
            <input
              type="text"
              className="plm-create-input"
              placeholder="New playlist name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
            >
              <FaPlus size={11} />
              <span>{isCreating ? "Creating..." : "Create"}</span>
            </button>
          </div>
        </div>

        <div className="plm-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
