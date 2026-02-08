import { useState } from "react";
import {
  useUserPlaylists,
  useCreatePlaylist,
  useAddVideoToPlaylist,
  useRemoveVideoFromPlaylist,
} from "./playlist.hooks";
import PlaylistItem from "./PlaylistItem";
import "./playlist.css";

const PlaylistModal = ({ videoId, onClose }) => {
  const { data: playlists = [], isLoading } = useUserPlaylists();
  const createPlaylist = useCreatePlaylist();
  const addVideo = useAddVideoToPlaylist();
  const removeVideo = useRemoveVideoFromPlaylist();

  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    createPlaylist.mutate(
      { name },
      { onSuccess: () => setName("") }
    );
  };

  const toggleVideo = (playlist) => {
    const isAdded = playlist.videos.some((video) => (video._id || video) === videoId);

    if (isAdded) {
      removeVideo.mutate({ playlistId: playlist._id, videoId });
    } else {
      addVideo.mutate({ playlistId: playlist._id, videoId });
    }
  };

  return (
    <div className="playlist-modal-backdrop">
      <div className="playlist-modal">
        <h3>Save to playlist</h3>

        {isLoading && <p>Loading playlists...</p>}

        {!isLoading &&
          playlists.map((playlist) => (
            <PlaylistItem
              key={playlist._id}
              playlist={playlist}
              videoId={videoId}
              onToggle={() => toggleVideo(playlist)}
            />
          ))}

        <div className="playlist-create">
          <input
            placeholder="New playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleCreate}>Create</button>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PlaylistModal;
