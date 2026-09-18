import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylistById,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../store/slices/playlistSlice";
import { FaTrash, FaPlay } from "react-icons/fa";
import "./styles/playlist.css";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPlaylist: playlist, loading, error } = useSelector(
    (state) => state.playlist
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (playlistId) {
      dispatch(fetchPlaylistById(playlistId));
    }
  }, [dispatch, playlistId]);

  if (loading && !playlist) {
    return (
      <div className="playlist-loading" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading playlist...</h2>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="playlist-error" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Playlist not found</h2>
        <button
          onClick={() => navigate("/playlists")}
          style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
        >
          Return to Playlists
        </button>
      </div>
    );
  }

  const isOwner = currentUser?._id && (currentUser._id === playlist.owner || currentUser._id === playlist.owner?._id);

  const handleRemoveVideo = async (e, videoId) => {
    e.stopPropagation();
    await dispatch(removeVideoFromPlaylist({ playlistId, videoId }));
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      const resultAction = await dispatch(deletePlaylist(playlistId));
      if (deletePlaylist.fulfilled.match(resultAction)) {
        navigate("/playlists");
      }
    }
  };

  const coverImage =
    playlist.videos && playlist.videos.length > 0 && playlist.videos[0].thumbnail
      ? playlist.videos[0].thumbnail
      : "https://via.placeholder.com/640x360?text=Empty+Playlist";

  return (
    <div className="playlist-page-container">
      {/* LEFT SIDEBAR - INFO */}
      <div className="playlist-sidebar">
        <div className="playlist-cover-wrapper">
          <img src={coverImage} alt="Cover" className="playlist-cover-img" />
          {playlist.videos && playlist.videos.length > 0 && (
            <div
              className="playlist-overlay"
              onClick={() => navigate(`/video/${playlist.videos[0]._id}`)}
              style={{ cursor: "pointer" }}
            >
              <FaPlay size={24} />
              <span>Play All</span>
            </div>
          )}
        </div>

        <h2 className="playlist-title">{playlist.name}</h2>

        <div className="playlist-meta">
          <span>{playlist.videos?.length || 0} videos</span>
          <span>•</span>
          <span>Updated recently</span>
        </div>

        {playlist.description && (
          <p className="playlist-description">{playlist.description}</p>
        )}

        {isOwner && (
          <button
            className="delete-playlist-btn"
            onClick={handleDeletePlaylist}
          >
            <FaTrash size={14} />
            Delete Playlist
          </button>
        )}
      </div>

      {/* RIGHT SIDE - VIDEO LIST */}
      <div className="playlist-content">
        {(!playlist.videos || playlist.videos.length === 0) ? (
          <div className="empty-playlist" style={{ padding: "40px", textAlign: "center" }}>
            <h3>This playlist is empty</h3>
            <p>Add videos from any video page.</p>
          </div>
        ) : (
          <div className="playlist-video-list">
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className="playlist-video-row"
                onClick={() => navigate(`/video/${video._id}`)}
              >
                <div className="video-index">{index + 1}</div>

                <div className="video-thumb-wrapper">
                  <img src={video.thumbnail} alt={video.title} />
                  <span className="duration-badge">
                    {video.duration
                      ? `${Math.floor(video.duration / 60)}:${String(
                          Math.floor(video.duration % 60)
                        ).padStart(2, "0")}`
                      : "0:00"}
                  </span>
                </div>

                <div className="video-info-col">
                  <h4 className="video-title">{video.title}</h4>
                  <p className="video-owner">
                    {video.owner?.fullName || "Unknown Channel"}
                  </p>
                </div>

                {isOwner && (
                  <button
                    className="remove-video-btn"
                    onClick={(e) => handleRemoveVideo(e, video._id)}
                    title="Remove from playlist"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;
