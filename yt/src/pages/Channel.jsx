import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannelProfile } from "../store/slices/channelSlice";
import { toggleSubscription } from "../store/slices/subscriptionSlice";
import VideoCard from "../components/common/VideoCard";
import EmptyState from "../components/common/EmptyState";
import {
  FaBell,
  FaCheck,
  FaVideo,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./styles/channel.css";

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("videos");

  const { channel, loading, error } = useSelector((state) => state.channel);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (username) {
      dispatch(fetchChannelProfile(username));
    }
  }, [dispatch, username]);

  const handleToggleSub = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/channel/${username}` } });
      return;
    }
    if (channel?._id) {
      dispatch(toggleSubscription(channel._id));
    }
  };

  if (loading && !channel) {
    return (
      <div className="ch-loading-wrapper">
        <div className="skeleton ch-cover-skeleton" />
        <div className="skeleton" style={{ width: "300px", height: "80px", margin: "20px 0" }} />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="ch-error-wrapper animate-fade-in">
        <FaExclamationTriangle className="ch-error-icon" />
        <h2>Channel not found</h2>
        <p>The channel @{username} doesn&rsquo;t exist or is currently unavailable.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    );
  }

  const isOwnChannel = currentUser?._id && currentUser._id === channel._id;

  return (
    <div className="ch-container animate-fade-in">
      {/* CHANNEL COVER BANNER */}
      <div className="ch-cover-wrapper">
        <img
          src={
            channel.coverImage ||
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80"
          }
          alt="cover"
          className="ch-cover-img"
        />
        <div className="ch-cover-overlay" />
      </div>

      {/* CHANNEL IDENTITY ROW */}
      <div className="ch-header">
        <div className="ch-avatar-wrapper">
          <img
            src={
              channel.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${channel.fullName || "User"}`
            }
            alt={channel.username}
            className="ch-avatar-img"
          />
        </div>

        <div className="ch-meta">
          <h1 className="ch-name">{channel.fullName}</h1>
          <span className="ch-handle">@{channel.username}</span>
          <div className="ch-sub-counts">
            <span>{channel.subscribersCount || 0} subscribers</span>
            <span className="ch-dot">•</span>
            <span>{channel.videos?.length || 0} videos</span>
          </div>
        </div>

        {!isOwnChannel && (
          <div className="ch-actions">
            <button
              className={`btn ${
                channel.isSubscribed
                  ? "btn-secondary ch-subscribed-btn"
                  : "btn-primary ch-subscribe-btn"
              }`}
              onClick={handleToggleSub}
            >
              {channel.isSubscribed ? (
                <>
                  <FaBell size={13} />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="ch-tabs-bar">
        <button
          className={`ch-tab-btn ${activeTab === "videos" ? "ch-tab-active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          className={`ch-tab-btn ${activeTab === "about" ? "ch-tab-active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
      </div>

      {/* TAB CONTENT: VIDEOS */}
      {activeTab === "videos" && (
        <div className="ch-tab-content">
          {(!channel.videos || channel.videos.length === 0) ? (
            <EmptyState
              icon={<FaVideo />}
              title="No videos uploaded yet"
              description={`@${channel.username} hasn’t uploaded any public videos.`}
            />
          ) : (
            <div className="hm-video-grid">
              {channel.videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={{
                    ...video,
                    owner: {
                      _id: channel._id,
                      fullName: channel.fullName,
                      username: channel.username,
                      avatar: channel.avatar,
                    },
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ABOUT */}
      {activeTab === "about" && (
        <div className="ch-about-card">
          <h3>Channel Details</h3>
          <div className="ch-about-item">
            <span className="ch-about-label">Creator</span>
            <span className="ch-about-val">{channel.fullName} (@{channel.username})</span>
          </div>
          <div className="ch-about-item">
            <span className="ch-about-label">Total Subscribers</span>
            <span className="ch-about-val">{(channel.subscribersCount || 0).toLocaleString()}</span>
          </div>
          <div className="ch-about-item">
            <span className="ch-about-label">Total Videos</span>
            <span className="ch-about-val">{(channel.videos?.length || 0).toLocaleString()}</span>
          </div>
          {channel.email && (
            <div className="ch-about-item">
              <span className="ch-about-label">Business Inquiries</span>
              <span className="ch-about-val">{channel.email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Channel;
