import React, { useState } from "react";
import { useChannelStats } from "../features/dashboard/dashboard.hooks";
import { useDeleteVideo } from "../features/video/video.hooks";
import { useUpdateAvatar, useUpdateCoverImage } from "../features/auth/auth.hooks";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import { FaEdit } from "react-icons/fa";
import "./styles/dashboard.css"; // Ensure this path is correct based on where this file is

import { uploadFileToS3 } from "../utils/s3.upload";

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useChannelStats();
  const deleteMutation = useDeleteVideo();
  const updateAvatarMutation = useUpdateAvatar();
  const updateCoverMutation = useUpdateCoverImage();
  const navigate = useNavigate();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (type === "avatar") {
        const url = await uploadFileToS3(file, "avatar");
        if (url) {
          updateAvatarMutation.mutate({ avatar: url });
        }
      } else if (type === "cover") {
        const url = await uploadFileToS3(file, "cover-image");
        if (url) {
          updateCoverMutation.mutate({ coverImage: url });
        }
      }
    } catch (error) {
      console.error("Failed to update profile image:", error);
      alert("Failed to update image. Please try again.");
    }
  };

  const handleDelete = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      deleteMutation.mutate(videoId);
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="dashboard-page">
        <h2>Error loading dashboard stats</h2>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* HEADER */}
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
          onClose={() => setIsEditProfileOpen(false)}
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
              {stats.videos && stats.videos.length > 0 ? (
                stats.videos.map((video) => (
                  <tr key={video._id}>
                    <td>
                      <div className="table-video-cell">
                        <img src={video.thumbnail} alt={video.title} />
                        <span>{video.title.length > 30 ? video.title.slice(0, 30) + '...' : video.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`table-status ${video.isPublished ? 'status-published' : 'status-private'}`}>
                        {video.isPublished ? 'Published' : 'Private'}
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
                      {/* Add Edit/Delete functionality here if needed */}
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(video._id)}
                        disabled={deleteMutation.isLoading}
                      >
                        {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No videos found. Start uploading!
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