import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannelStats, removeVideoFromDashboardStats } from "../store/slices/dashboardSlice";
import { deleteVideo } from "../store/slices/videoSlice";
import { updateAvatar, updateCoverImage } from "../store/slices/authSlice";
import EditProfileModal from "../components/EditProfileModal";
import { FaEdit } from "react-icons/fa";
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
    const file = e.target.files[0];
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
    if (window.confirm("Are you sure you want to delete this video?")) {
      setDeletingId(videoId);
      await dispatch(deleteVideo(videoId));
      dispatch(removeVideoFromDashboardStats(videoId));
      setDeletingId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="dashboard-page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Error loading dashboard</h2>
        <p style={{ color: "#e74c3c", margin: "10px 0 20px" }}>{error}</p>
        <button
          onClick={() => dispatch(fetchChannelStats())}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* PROFILE HEADER */}
      <div className="profile-header">
        {/* COVER IMAGE */}
        <div className="cover-wrapper">
          <img
            src={stats?.coverImage || "https://via.placeholder.com/1200x300?text=Cover+Image"}
            alt="cover"
            className="cover-image"
          />
          <label className="edit-btn cover-edit-btn">
            📷 Edit Cover
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleFileChange(e, "cover")}
            />
          </label>
        </div>

        {/* AVATAR & INFO */}
        <div className="profile-info-section">
          <div className="avatar-wrapper">
            <img
              src={stats?.avatar || "https://via.placeholder.com/150?text=User"}
              alt="avatar"
              className="profile-avatar"
            />
            <label className="edit-btn avatar-edit-btn">
              ✏️
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
              />
            </label>
          </div>

          <div className="user-details">
            <div className="user-header-row">
              <h2>{stats?.fullName}</h2>
              <button
                className="edit-profile-icon-btn"
                onClick={() => setIsEditProfileOpen(true)}
                title="Edit Profile"
              >
                <FaEdit />
              </button>
            </div>
            <p>@{stats?.username}</p>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => {
            setIsEditProfileOpen(false);
            dispatch(fetchChannelStats());
          }}
          user={stats}
        />
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats?.totalViews?.toLocaleString() || 0}</h3>
            <p>Total Views</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.totalSubscribers?.toLocaleString() || 0}</h3>
            <p>Subscribers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <h3>{stats?.totalLikes?.toLocaleString() || 0}</h3>
            <p>Total Likes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📹</div>
          <div className="stat-info">
            <h3>{stats?.totalVideos?.toLocaleString() || 0}</h3>
            <p>Videos Uploaded</p>
          </div>
        </div>
      </div>

      {/* RECENT VIDEOS TABLE */}
      <div className="dashboard-videos">
        <h3>Recent Uploads</h3>

        <div className="video-table-container">
          <table className="video-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Status</th>
                <th>Date Uploaded</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.videos && stats.videos.length > 0 ? (
                stats.videos.map((video) => (
                  <tr key={video._id}>
                    <td>
                      <div className="table-video-cell">
                        <img src={video.thumbnail} alt={video.title} />
                        <span>
                          {video.title.length > 30
                            ? video.title.slice(0, 30) + "..."
                            : video.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`table-status ${
                          video.isPublished ? "status-published" : "status-private"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Private"}
                      </span>
                    </td>
                    <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                    <td>{video.views || 0}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/video/${video._id}`)}
                      >
                        View
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(video._id)}
                        disabled={deletingId === video._id}
                      >
                        {deletingId === video._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                    No videos uploaded yet. Start uploading!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;