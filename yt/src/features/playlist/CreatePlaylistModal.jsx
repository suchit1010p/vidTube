import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlaylist } from "../../store/slices/playlistSlice";
import { FaTimes, FaPlus } from "react-icons/fa";
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
    <div className="plm-backdrop" onClick={onClose}>
      <div className="plm-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="plm-header">
          <h3>Create New Playlist</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleCreate}>
          <div className="plm-body">
            <div className="form-input-group">
              <label className="form-label" htmlFor="newPlaylistName">
                Playlist Name <span style={{ color: "var(--accent-primary)" }}>*</span>
              </label>
              <input
                id="newPlaylistName"
                type="text"
                className="form-control"
                placeholder="e.g. Chill Beats, Coding Tutorials"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-input-group">
              <label className="form-label" htmlFor="newPlaylistDesc">
                Description (optional)
              </label>
              <textarea
                id="newPlaylistDesc"
                className="form-control"
                placeholder="What's the purpose of this playlist?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="plm-footer">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting || !name.trim()}
            >
              <FaPlus size={11} />
              <span>{isSubmitting ? "Creating..." : "Create Playlist"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
