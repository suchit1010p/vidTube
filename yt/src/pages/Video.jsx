import { useNavigate, useParams } from "react-router-dom";
import { useVideoById } from "../features/video/video.hooks";
import { useToggleVideoLike } from "../features/like/like.hooks";
import { useChannelProfile } from "../features/auth/auth.hooks";
import { useToggleSubscription } from "../features/subscription/subscription.hooks";
import CommentList from "../features/comment/CommentList";
import { useState } from "react";
import PlaylistModal from "../features/playlist/PlaylistModal";
import { FaThumbsUp, FaShare, FaPlus, FaCheck } from "react-icons/fa";

import "./styles/video.css";

const Video = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { data: video, isLoading, isError } = useVideoById(videoId);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const likeMutation = useToggleVideoLike(videoId);
  const channelUsername = video?.owner?.username;
  const channelId = video?.owner?._id;

  const { data: channel } = useChannelProfile(channelUsername);
  const subscriptionMutation = useToggleSubscription(channelId, channelUsername);

  if (isLoading) return <div className="video-loading">Loading video...</div>;
  if (isError || !video) return <div className="video-error">Video not found</div>;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="video-page-container">
      {/* PRIMARY COLUMN */}
      <div className="primary-column">
        {/* VIDEO PLAYER */}
        <div className="video-player-wrapper">
          <video
            src={video.videoFile}
            controls
            autoPlay
            className="video-player"
          />
        </div>

        {/* DATE & TITLE */}
        <h1 className="video-title">{video.title}</h1>

        {/* INFO BAR: CHANNEL & ACTIONS */}
        <div className="video-info-bar">
          <div className="owner-section">
            {channel && (
              <>
                <div
                  className="owner-avatar-wrapper"
                  onClick={() => navigate(`/channel/${channel.username}`)}
                >
                  <img
                    src={channel.avatar || "https://via.placeholder.com/50"}
                    alt={channel.username}
                    className="owner-avatar"
                  />
                </div>
                <div className="owner-text">
                  <h3
                    onClick={() => navigate(`/channel/${channel.username}`)}
                    className="owner-name"
                  >
                    {channel.fullName}
                  </h3>
                  <p className="owner-subs">{channel.subscribersCount} subscribers</p>
                </div>
                <button
                  className={`subscribe-btn ${channel.isSubscribed ? "subscribed" : ""}`}
                  onClick={() => subscriptionMutation.mutate()}
                  disabled={subscriptionMutation.isLoading}
                >
                  {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </>
            )}
          </div>

          <div className="actions-section">
            <button
              className="action-pill-btn"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isLoading}
            >
              <FaThumbsUp className={video.isLiked ? "icon-liked" : ""} />
              <span>{video.totalLikes}</span>
            </button>

            <button className="action-pill-btn" onClick={handleShare}>
              <FaShare />
              <span>Share</span>
            </button>

            <button className="action-pill-btn" onClick={() => setShowPlaylist(true)}>
              <FaPlus />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="description-box">
          <div className="description-stats">
            <span>{video.totalViews?.toLocaleString()} views</span>
            <span> • {new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          <p className={`description-text ${isDescriptionExpanded ? "expanded" : ""}`}>
            {video.description}
          </p>
          {video.description && video.description.length > 100 && (
            <button
              className="show-more-btn"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? "Show less" : "...more"}
            </button>
          )}
        </div>

        {/* COMMENTS SECTION */}
        <div className="comments-section-wrapper">
          <CommentList videoId={videoId} />
        </div>
      </div>

      {/* SECONDARY COLUMN (RECOMMENDATIONS) */}
      <div className="secondary-column">
        {/* Placeholder for related videos */}
        {/* <div className="related-videos-placeholder">Related Videos Coming Soon...</div> */}
      </div>

      {/* MODALS */}
      {showPlaylist && (
        <PlaylistModal
          videoId={video._id}
          onClose={() => setShowPlaylist(false)}
        />
      )}
    </div>
  );
};

export default Video;
