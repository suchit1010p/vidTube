import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById, fetchVideos } from "../store/slices/videoSlice";
import { toggleVideoLike } from "../store/slices/likeSlice";
import { fetchChannelProfile } from "../store/slices/channelSlice";
import { toggleSubscription } from "../store/slices/subscriptionSlice";
import CommentList from "../features/comment/CommentList";
import PlaylistModal from "../features/playlist/PlaylistModal";
import VideoCard from "../components/common/VideoCard";
import Toast from "../components/common/Toast";
import {
  FaThumbsUp,
  FaShare,
  FaPlus,
  FaBell,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { formatViews, formatTimeAgo } from "../components/common/VideoCard";
import "./styles/video.css";

const Video = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const { currentVideo: video, detailLoading, videos: recommendedVideos, error } = useSelector(
    (state) => state.video
  );
  const { user } = useSelector((state) => state.auth);
  const { channel } = useSelector((state) => state.channel);

  // Fetch video details
  useEffect(() => {
    if (videoId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      dispatch(fetchVideoById(videoId));
    }
  }, [dispatch, videoId]);

  // Fetch creator channel profile for subscriber status
  useEffect(() => {
    if (video?.owner?.username) {
      dispatch(fetchChannelProfile(video.owner.username));
    }
  }, [dispatch, video?.owner?.username]);

  // Fetch recommended videos for sidebar
  useEffect(() => {
    if (!recommendedVideos || recommendedVideos.length === 0) {
      dispatch(fetchVideos({ limit: 8, sortBy: "views", sortType: "desc" }));
    }
  }, [dispatch, recommendedVideos]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleLike = () => {
    if (!user) {
      navigate("/login", { state: { from: `/video/${videoId}` } });
      return;
    }
    dispatch(toggleVideoLike(videoId));
  };

  const handleSubscribe = () => {
    if (!user) {
      navigate("/login", { state: { from: `/video/${videoId}` } });
      return;
    }
    const targetChannelId = video?.owner?._id || channel?._id;
    if (targetChannelId) {
      dispatch(toggleSubscription(targetChannelId));
    }
  };

  const handleSaveToPlaylist = () => {
    if (!user) {
      navigate("/login", { state: { from: `/video/${videoId}` } });
      return;
    }
    setShowPlaylistModal(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Video link copied to clipboard!");
    } else {
      showToast("Could not copy link", "error");
    }
  };

  if (detailLoading) {
    return (
      <div className="vp-loading-container animate-fade-in">
        <div className="vp-player-skeleton skeleton" />
        <div className="skeleton" style={{ height: "24px", width: "70%", marginTop: "20px" }} />
        <div className="skeleton" style={{ height: "48px", width: "100%", marginTop: "16px" }} />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="vp-error-container animate-fade-in">
        <FaExclamationTriangle className="vp-error-icon" />
        <h2>Video not available</h2>
        <p>{error || "This video might have been removed or is no longer accessible."}</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Return to Home
        </button>
      </div>
    );
  }

  const isOwnChannel =
    user?._id && (user._id === video.owner?._id || user._id === channel?._id);

  // Filter out current video from recommendations
  const sidebarQueue = (recommendedVideos || []).filter((v) => v._id !== videoId);

  return (
    <div className="vp-container">
      {/* FLOATING TOAST */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="vp-layout">
        {/* PRIMARY COLUMN (Player, Meta, Description, Comments) */}
        <div className="vp-primary-col">
          {/* CINEMA VIDEO PLAYER */}
          <div className="vp-player-wrapper">
            <video
              src={video.videoFile}
              controls
              autoPlay
              className="vp-video-element"
              poster={video.thumbnail}
            />
          </div>

          {/* VIDEO TITLE */}
          <h1 className="vp-title">{video.title}</h1>

          {/* CREATOR & ACTIONS TOOLBAR */}
          <div className="vp-toolbar">
            {/* CREATOR IDENTITY */}
            <div className="vp-creator-info">
              <Link
                to={`/channel/${video.owner?.username}`}
                className="vp-creator-avatar-link"
              >
                <img
                  src={
                    video.owner?.avatar ||
                    channel?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${video.owner?.fullName || "Creator"}`
                  }
                  alt={video.owner?.fullName || "channel"}
                  className="vp-creator-avatar"
                />
              </Link>

              <div className="vp-creator-meta">
                <Link
                  to={`/channel/${video.owner?.username}`}
                  className="vp-creator-name"
                >
                  {video.owner?.fullName || channel?.fullName || "Creator"}
                </Link>
                <span className="vp-creator-subs">
                  {channel?.subscribersCount ?? 0} subscribers
                </span>
              </div>

              {!isOwnChannel && (
                <button
                  className={`btn ${
                    channel?.isSubscribed
                      ? "btn-secondary vp-subscribed-btn"
                      : "btn-primary vp-subscribe-btn"
                  }`}
                  onClick={handleSubscribe}
                >
                  {channel?.isSubscribed ? (
                    <>
                      <FaBell size={12} />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              )}
            </div>

            {/* ACTION BUTTON PILLS */}
            <div className="vp-actions">
              <button
                className={`vp-action-btn ${video.isLiked ? "vp-action-liked" : ""}`}
                onClick={handleLike}
                title={video.isLiked ? "Unlike video" : "Like video"}
              >
                <FaThumbsUp />
                <span>{video.totalLikes ?? 0}</span>
              </button>

              <button className="vp-action-btn" onClick={handleShare} title="Share video">
                <FaShare />
                <span>Share</span>
              </button>

              <button
                className="vp-action-btn"
                onClick={handleSaveToPlaylist}
                title="Save to playlist"
              >
                <FaPlus />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* EXPANDABLE DESCRIPTION BOX */}
          <div className="vp-description-card">
            <div className="vp-desc-header">
              <span className="vp-desc-views">{formatViews(video.views ?? video.totalViews)}</span>
              <span className="vp-desc-date">{formatTimeAgo(video.createdAt)}</span>
            </div>

            <p className={`vp-desc-text ${isDescExpanded ? "vp-desc-expanded" : ""}`}>
              {video.description || "No description provided for this video."}
            </p>

            {video.description && video.description.length > 120 && (
              <button
                className="vp-desc-toggle"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
              >
                {isDescExpanded ? "Show less" : "...more"}
              </button>
            )}
          </div>

          {/* COMMENTS SECTION */}
          <div className="vp-comments-section">
            <CommentList videoId={videoId} />
          </div>
        </div>

        {/* SIDEBAR COLUMN (Recommendations / Up Next) */}
        <aside className="vp-sidebar-col">
          <h3 className="vp-sidebar-heading">Up Next</h3>
          <div className="vp-recommendations-list">
            {sidebarQueue.map((recVideo) => (
              <VideoCard
                key={recVideo._id}
                video={recVideo}
                layout="compact"
              />
            ))}
          </div>
        </aside>
      </div>

      {/* SAVE TO PLAYLIST MODAL */}
      {showPlaylistModal && (
        <PlaylistModal
          videoId={videoId}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
};

export default Video;
