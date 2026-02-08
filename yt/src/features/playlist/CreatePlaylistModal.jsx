import { useState } from "react";
import { useCreatePlaylist } from "./playlist.hooks";
import "./playlist.css"; // Reusing existing playlist styles or we can add specific ones

const CreatePlaylistModal = ({ onClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const createPlaylist = useCreatePlaylist();

    const handleCreate = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        createPlaylist.mutate(
            { name, description },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <div className="playlist-modal-backdrop">
            <div className="playlist-modal">
                <h3>Create New Playlist</h3>

                <form onSubmit={handleCreate} className="create-playlist-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter playlist name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (optional)</label>
                        <textarea
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
                            disabled={createPlaylist.isLoading}
                        >
                            {createPlaylist.isLoading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;
