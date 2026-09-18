import React from "react";
import { useNavigate } from "react-router-dom";
import "./videoCard.css";

export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const formatViews = (views) => {
  const count = Number(views) || 0;
  if (count === 0) return "0 views";
  if (count === 1) return "1 view";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
  return `${count} views`;
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

const VideoCard = ({ video, layout = "grid" }) => {
  const navigate = useNavigate();

  if (!video) return null;

  const handleCardClick = () => {
    navigate(`/video/${video._id}`);
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (video.owner?.username) {
      navigate(`/channel/${video.owner.username}`);
    }
  };

  const isCompact = layout === "compact";

  return (
    <div
      className={`vc-card ${isCompact ? "vc-compact" : "vc-grid"} animate-fade-in`}
      onClick={handleCardClick}
    >
      {/* THUMBNAIL CONTAINER */}
      <div className="vc-thumb-wrapper">
        <img
          src={video.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&q=80"}
          alt={video.title}
          className="vc-thumb"
          loading="lazy"
        />
        <div className="vc-thumb-overlay" />
        {video.duration > 0 && (
          <span className="vc-duration-badge">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      {/* DETAILS / META */}
      <div className="vc-details">
        {!isCompact && (
          <div className="vc-avatar-col" onClick={handleChannelClick}>
            <img
              src={
                video.owner?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${video.owner?.fullName || "User"}`
              }
              alt={video.owner?.username || "creator"}
              className="vc-avatar"
            />
          </div>
        )}

        <div className="vc-meta">
          <h3 className="vc-title" title={video.title}>
            {video.title}
          </h3>

          <div className="vc-channel" onClick={handleChannelClick}>
            <span>{video.owner?.fullName || video.owner?.username || "Creator"}</span>
          </div>

          <div className="vc-stats">
            <span>{formatViews(video.views ?? video.totalViews)}</span>
            <span className="vc-dot">•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
