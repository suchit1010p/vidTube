import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChannelStats,
  removeVideoFromDashboardStats,
} from "../store/slices/dashboardSlice";
import { deleteVideo } from "../store/slices/videoSlice";
import { updateAvatar, updateCoverImage } from "../store/slices/authSlice";
import EditProfileModal from "../components/EditProfileModal";
import EmptyState from "../components/common/EmptyState";
import {
  FaEye,
  FaUsers,
  FaHeart,
  FaVideo,
  FaCamera,
  FaTrash,
  FaExternalLinkAlt,
  FaUserEdit,
  FaPlus,
} from "react-icons/fa";
import { formatDuration, formatTimeAgo, formatViews } from "../components/common/VideoCard";
import "./styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchChannelStats());
  }, [dispatch]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    if (type === "avatar") {
      formData.append("avatar", file);
      await dispatch(updateAvatar(formData));
      dispatch(fetchChannelStats());
    } else if (type === "cover") {
      formData.append("coverImage", file);
      await dispatch(updateCoverImage(formData));
      dispatch(fetchChannelStats());
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video? This cannot be undone.")) {
      setDeletingId(videoId);
      await dispatch(deleteVideo(videoId));
      dispatch(removeVideoFromDashboardStats(videoId));
      setDeletingId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="db-loading-wrapper">
        <div className="skeleton db-hero-skeleton" />
        <div className="db-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "100px", borderRadius: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="db-container animate-fade-in">
      {/* CHANNEL HERO BANNER */}
      <div className="db-hero-card">
        <div className="db-cover-wrapper">
          <img
            src={
              stats?.coverImage ||
              "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80"
            }
            alt="channel cover"
            className="db-cover-image"
          />
          <div className="db-cover-overlay" />
          <label className="db-change-cover-btn" title="Change Cover Banner">
            <FaCamera />
            <span>Change Cover</span>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleFileChange(e, "cover")}
            />
          </label>
        </div>

        {/* PROFILE IDENTITY ROW */}
        <div className="db-profile-row">
          <div className="db-avatar-wrapper">
            <img
              src={
                stats?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${stats?.fullName || "User"}`
              }
              alt="avatar"
              className="db-avatar-img"
            />
            <label className="db-avatar-edit-overlay" title="Update profile photo">
              <FaCamera />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
              />
            </label>
          </div>

          <div className="db-profile-meta">
            <h1 className="db-user-name">{stats?.fullName || "Creator"}</h1>
            <span className="db-user-handle">@{stats?.username}</span>
          </div>

          <div className="db-hero-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <FaUserEdit />
              <span>Edit Profile</span>
            </button>
            <Link to="/publish-video" className="btn btn-primary btn-sm">
              <FaPlus />
              <span>Upload Video</span>
            </Link>
          </div>
        </div>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="db-stats-grid">
        <div className="db-stat-card">
          <div className="db-stat-icon-wrapper db-icon-views">
            <FaEye />
          </div>
          <div className="db-stat-info">
            <span className="db-stat-label">Total Views</span>
            <h3 className="db-stat-value">{(stats?.totalViews || 0).toLocaleString()}</h3>
          </div>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-icon-wrapper db-icon-subs">
            <FaUsers />
          </div>
          <div className="db-stat-info">
            <span className="db-stat-label">Subscribers</span>
            <h3 className="db-stat-value">{(stats?.totalSubscribers || 0).toLocaleString()}</h3>
          </div>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-icon-wrapper db-icon-likes">
            <FaHeart />
          </div>
          <div className="db-stat-info">
            <span className="db-stat-label">Total Likes</span>
            <h3 className="db-stat-value">{(stats?.totalLikes || 0).toLocaleString()}</h3>
          </div>
        </div>

        <div className="db-stat-card">
          <div className="db-stat-icon-wrapper db-icon-videos">
            <FaVideo />
          </div>
          <div className="db-stat-info">
            <span className="db-stat-label">Uploaded Videos</span>
            <h3 className="db-stat-value">{(stats?.totalVideos || 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* UPLOADED VIDEOS LIST / TABLE */}
      <div className="db-videos-section">
        <div className="db-section-header">
          <h2 className="db-section-title">Your Videos</h2>
          <span className="db-video-count-badge badge badge-dark">
            {stats?.videos?.length || 0} Total
          </span>
        </div>

        {(!stats?.videos || stats.videos.length === 0) ? (
          <EmptyState
            icon={<FaVideo />}
            title="No videos published yet"
            description="Start building your channel by publishing your first video."
            actionText="Upload Video"
            onAction={() => navigate("/publish-video")}
          />
        ) : (
          <div className="db-table-container">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.videos.map((vid) => (
                  <tr key={vid._id} className="db-table-row">
                    <td>
                      <div className="db-table-video-cell">
                        <div className="db-table-thumb-wrapper">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="db-table-thumb"
                          />
                          {vid.duration > 0 && (
                            <span className="db-table-duration">
                              {formatDuration(vid.duration)}
                            </span>
                          )}
                        </div>
                        <span className="db-table-title" title={vid.title}>
                          {vid.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          vid.isPublished !== false ? "badge-success" : "badge-danger"
                        }`}
                      >
                        {vid.isPublished !== false ? "Published" : "Private"}
                      </span>
                    </td>
                    <td>
                      <span className="db-table-date">{formatTimeAgo(vid.createdAt)}</span>
                    </td>
                    <td>
                      <span className="db-table-views">{formatViews(vid.views)}</span>
                    </td>
                    <td>
                      <div className="db-table-actions">
                        <button
                          className="btn btn-secondary btn-sm db-action-btn"
                          onClick={() => navigate(`/video/${vid._id}`)}
                          title="View video"
                        >
                          <FaExternalLinkAlt size={12} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm db-action-btn"
                          onClick={() => handleDelete(vid._id)}
                          disabled={deletingId === vid._id}
                          title="Delete video"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => {
          setIsEditProfileOpen(false);
          dispatch(fetchChannelStats());
        }}
        user={stats}
      />
    </div>
  );
};

export default Dashboard;