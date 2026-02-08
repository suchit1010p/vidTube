import { useParams, useNavigate } from "react-router-dom";
import {
  usePlaylistById,
  useRemoveVideoFromPlaylist,
  useDeletePlaylist,
} from "../features/playlist/playlist.hooks";
import { useCurrentUser } from "../features/auth/auth.hooks";
import { FaTrash, FaPlay, FaClock } from "react-icons/fa";
import "./styles/playlist.css";

const Playlist = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const { data: playlist, isLoading, isError } = usePlaylistById(playlistId);
  const removeVideo = useRemoveVideoFromPlaylist();
  const deletePlaylist = useDeletePlaylist();
  const { data: currentUser } = useCurrentUser();

  if (isLoading) return <div className="playlist-loading">Loading playlist...</div>;
  if (isError || !playlist) return <div className="playlist-error">Playlist not found</div>;

  const isOwner = currentUser?._id === playlist.owner;

  const handleRemoveVideo = (e, videoId) => {
    e.stopPropagation();
    removeVideo.mutate({ playlistId, videoId });
  };

  const handleDeletePlaylist = () => {
    if (window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      deletePlaylist.mutate(playlistId, {
        onSuccess: () => {
          navigate("/playlists");
        }
      });
    }
  };

  // Calculate total duration (assuming duration is in seconds)
  // If backend provides duration, great. If not, this is a placeholder or 0.
  const totalDuration = playlist.videos.reduce((acc, video) => acc + (video.duration || 0), 0);
  const formattedDuration = totalDuration > 3600
    ? `${(totalDuration / 3600).toFixed(1)} hours`
    : `${(totalDuration / 60).toFixed(0)} mins`;

  const coverImage = playlist.videos.length > 0 ? playlist.videos[0].thumbnail : "https://via.placeholder.com/640x360?text=Empty+Playlist";

  return (
    <div className="playlist-page-container">
      {/* LEFT SIDEBAR - INFO */}
      <div className="playlist-sidebar">
        <div className="playlist-cover-wrapper">
          <img src={coverImage} alt="Cover" className="playlist-cover-img" />
          <div className="playlist-overlay">
            <FaPlay size={24} />
            <span>Play All</span>
          </div>
        </div>

        <h2 className="playlist-title">{playlist.name}</h2>

        <div className="playlist-meta">
          <span>{playlist.videos.length} videos</span>
          <span>•</span>
          <span>Updated today</span>
        </div>

        {playlist.description && (
          <p className="playlist-description">{playlist.description}</p>
        )}

        {isOwner && (
          <button
            className="delete-playlist-btn"
            onClick={handleDeletePlaylist}
            disabled={deletePlaylist.isLoading}
          >
            <FaTrash size={14} />
            {deletePlaylist.isLoading ? "Deleting..." : "Delete Playlist"}
          </button>
        )}
      </div>

      {/* RIGHT SIDE - VIDEO LIST */}
      <div className="playlist-content">
        {playlist.videos.length === 0 ? (
          <div className="empty-playlist">
            <h3>This playlist is empty</h3>
            <p>Go add some videos!</p>
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
                    {video.duration ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}` : "0:00"}
                  </span>
                </div>

                <div className="video-info-col">
                  <h4 className="video-title">{video.title}</h4>
                  <p className="video-owner">{video.owner?.fullName || "Unknown Channel"}</p>
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

export default Playlist;
