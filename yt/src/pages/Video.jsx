import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoById } from "../store/slices/videoSlice";
import { toggleVideoLike } from "../store/slices/likeSlice";
import { fetchChannelProfile } from "../store/slices/channelSlice";
import { toggleSubscription } from "../store/slices/subscriptionSlice";
import CommentList from "../features/comment/CommentList";
import PlaylistModal from "../features/playlist/PlaylistModal";
import { FaThumbsUp, FaShare, FaPlus } from "react-icons/fa";
import "./styles/video.css";

const Video = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { currentVideo: video, detailLoading, error } = useSelector(
    (state) => state.video
  );
  const { user } = useSelector((state) => state.auth);
  const { channel } = useSelector((state) => state.channel);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoById(videoId));
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    if (video?.owner?.username) {
      dispatch(fetchChannelProfile(video.owner.username));
    }
  }, [dispatch, video?.owner?.username]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
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
    setShowPlaylist(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard!");
  };

  if (detailLoading) {
    return (
      <div className="video-loading" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading video...</h2>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-error" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Video not found</h2>
        <button
          onClick={() => navigate("/")}
          style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  const isOwnChannel = user?._id && (user._id === video.owner?._id || user._id === channel?._id);

  return (
    <div className="video-page-container">
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#2ecc71",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "6px",
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* PRIMARY COLUMN */}
      <div className="primary-column">
        {/* VIDEO PLAYER */}
        <div className="video-player-wrapper">
          <video
            src={video.videoFile}
            controls
            autoPlay
            className="video-player"
            poster={video.thumbnail}
          />
        </div>

        {/* TITLE */}
        <h1 className="video-title">{video.title}</h1>

        {/* INFO BAR: CHANNEL & ACTIONS */}
        <div className="video-info-bar">
          <div className="owner-section">
            <div
              className="owner-avatar-wrapper"
              onClick={() => navigate(`/channel/${video.owner?.username}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={video.owner?.avatar || channel?.avatar || "https://via.placeholder.com/50"}
                alt={video.owner?.username || "channel"}
                className="owner-avatar"
              />
            </div>
            <div className="owner-text">
              <h3
                onClick={() => navigate(`/channel/${video.owner?.username}`)}
                className="owner-name"
                style={{ cursor: "pointer" }}
              >
                {video.owner?.fullName || channel?.fullName || "Creator"}
              </h3>
              <p className="owner-subs">
                {channel?.subscribersCount ?? 0} subscribers
              </p>
            </div>

            {!isOwnChannel && (
              <button
                className={`subscribe-btn ${channel?.isSubscribed ? "subscribed" : ""}`}
                onClick={handleSubscribe}
              >
                {channel?.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          <div className="actions-section">
            <button
              className="action-pill-btn"
              onClick={handleLike}
              title={video.isLiked ? "Unlike" : "Like"}
            >
              <FaThumbsUp className={video.isLiked ? "icon-liked" : ""} />
              <span>{video.totalLikes ?? 0}</span>
            </button>

            <button className="action-pill-btn" onClick={handleShare} title="Share video">
              <FaShare />
              <span>Share</span>
            </button>

            <button
              className="action-pill-btn"
              onClick={handleSaveToPlaylist}
              title="Save to playlist"
            >
              <FaPlus />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="description-box">
          <div className="description-stats">
            <span>{(video.totalViews ?? video.views ?? 0).toLocaleString()} views</span>
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

      {/* SECONDARY COLUMN */}
      <div className="secondary-column" />

      {/* PLAYLIST MODAL */}
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
