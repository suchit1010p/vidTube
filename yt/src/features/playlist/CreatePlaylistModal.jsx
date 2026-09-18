import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlaylist } from "../../store/slices/playlistSlice";
import "./playlist.css";

const CreatePlaylistModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const resultAction = await dispatch(
      createPlaylist({ name: name.trim(), description: description.trim() })
    );
    setIsSubmitting(false);

    if (createPlaylist.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  return (
    <div className="playlist-modal-backdrop" onClick={onClose}>
      <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Create New Playlist</h3>

        <form onSubmit={handleCreate} className="create-playlist-form">
          <div className="form-group">
            <label htmlFor="playlistName">Name</label>
            <input
              id="playlistName"
              type="text"
              placeholder="Enter playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="playlistDesc">Description (optional)</label>
            <textarea
              id="playlistDesc"
              placeholder="Enter playlist description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
