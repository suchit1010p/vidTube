import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../../store/slices/playlistSlice";
import PlaylistItem from "./PlaylistItem";
import "./playlist.css";

const PlaylistModal = ({ videoId, onClose }) => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.playlist);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchUserPlaylists());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const resultAction = await dispatch(createPlaylist({ name: name.trim() }));
    if (createPlaylist.fulfilled.match(resultAction)) {
      setName("");
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
    <div className="playlist-modal-backdrop" onClick={onClose}>
      <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Save to playlist</h3>

        {loading && <p>Loading playlists...</p>}

        {!loading && (playlists || []).length === 0 && (
          <p style={{ color: "#888", padding: "10px 0" }}>No playlists yet. Create one below.</p>
        )}

        <div className="playlist-items-container">
          {!loading &&
            (playlists || []).map((playlist) => (
              <PlaylistItem
                key={playlist._id}
                playlist={playlist}
                videoId={videoId}
                onToggle={() => toggleVideo(playlist)}
              />
            ))}
        </div>

        <div className="playlist-create">
          <input
            placeholder="New playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <button onClick={handleCreate} disabled={!name.trim()}>
            Create
          </button>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PlaylistModal;
