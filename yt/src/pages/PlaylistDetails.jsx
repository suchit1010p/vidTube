import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylistById,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../store/slices/playlistSlice";
import EmptyState from "../components/common/EmptyState";
import { FaTrash, FaPlay, FaVideo, FaExclamationTriangle } from "react-icons/fa";
import { formatDuration } from "../components/common/VideoCard";
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
      <div className="pld-container">
        <div className="skeleton" style={{ height: "300px", width: "100%", borderRadius: "16px" }} />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="pld-error-wrapper animate-fade-in">
        <FaExclamationTriangle className="pld-error-icon" />
        <h2>Playlist not found</h2>
        <p>{error || "This playlist doesn't exist or may have been deleted."}</p>
        <button className="btn btn-primary" onClick={() => navigate("/playlists")}>
          Return to Playlists
        </button>
      </div>
    );
  }

  const isOwner =
    currentUser?._id &&
    (currentUser._id === playlist.owner || currentUser._id === playlist.owner?._id);

  const handleRemoveVideo = async (e, videoId) => {
    e.stopPropagation();
    await dispatch(removeVideoFromPlaylist({ playlistId, videoId }));
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm("Are you sure you want to delete this playlist? This cannot be undone.")) {
      const resultAction = await dispatch(deletePlaylist(playlistId));
      if (deletePlaylist.fulfilled.match(resultAction)) {
        navigate("/playlists");
      }
    }
  };

  const firstVideo = playlist.videos?.[0];
  const coverThumb =
    firstVideo?.thumbnail ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&q=80";

  return (
    <div className="pld-container animate-fade-in">
      {/* LEFT SIDEBAR: PLAYLIST INFO CARD */}
      <div className="pld-sidebar">
        <div className="pld-cover-wrapper">
          <img src={coverThumb} alt={playlist.name} className="pld-cover-img" />
          {playlist.videos && playlist.videos.length > 0 && (
            <button
              className="pld-play-all-overlay"
              onClick={() => navigate(`/video/${playlist.videos[0]._id}`)}
              title="Play All"
            >
              <FaPlay size={20} />
              <span>Play All</span>
            </button>
          )}
        </div>

        <h1 className="pld-name">{playlist.name}</h1>

        <div className="pld-meta-tags">
          <span>{playlist.videos?.length || 0} videos</span>
        </div>

        {playlist.description && (
          <p className="pld-description">{playlist.description}</p>
        )}

        {isOwner && (
          <button
            className="btn btn-danger btn-sm pld-delete-btn"
            onClick={handleDeletePlaylist}
          >
            <FaTrash size={12} />
            <span>Delete Playlist</span>
          </button>
        )}
      </div>

      {/* RIGHT CONTENT: VIDEO QUEUE */}
      <div className="pld-content">
        {(!playlist.videos || playlist.videos.length === 0) ? (
          <EmptyState
            icon={<FaVideo />}
            title="Playlist is empty"
            description="Add videos to this playlist by clicking the Save button on any video page."
          />
        ) : (
          <div className="pld-video-list">
            {playlist.videos.map((vid, index) => (
              <div
                key={vid._id}
                className="pld-video-row animate-fade-in"
                onClick={() => navigate(`/video/${vid._id}`)}
              >
                <span className="pld-row-index">{index + 1}</span>

                <div className="pld-row-thumb-wrapper">
                  <img src={vid.thumbnail} alt={vid.title} className="pld-row-thumb" />
                  {vid.duration > 0 && (
                    <span className="pld-row-duration">
                      {formatDuration(vid.duration)}
                    </span>
                  )}
                </div>

                <div className="pld-row-info">
                  <h4 className="pld-row-title">{vid.title}</h4>
                  <span className="pld-row-channel">
                    {vid.owner?.fullName || "Creator"}
                  </span>
                </div>

                {isOwner && (
                  <button
                    className="pld-row-remove-btn"
                    onClick={(e) => handleRemoveVideo(e, vid._id)}
                    title="Remove from playlist"
                  >
                    <FaTrash size={12} />
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
