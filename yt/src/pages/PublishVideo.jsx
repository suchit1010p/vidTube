import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { publishVideo } from "../store/slices/videoSlice";
import {
  FaCloudUploadAlt,
  FaImage,
  FaFileVideo,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import "./styles/publish-video.css";

const PublishVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const { uploadLoading, error } = useSelector((state) => state.video);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setLocalError("");
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setLocalError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!title.trim()) {
      setLocalError("Please enter a video title.");
      return;
    }
    if (!description.trim()) {
      setLocalError("Please provide a description for your video.");
      return;
    }
    if (!videoFile) {
      setLocalError("Please select a video file to upload.");
      return;
    }
    if (!thumbnail) {
      setLocalError("Please upload a thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("thumbnail", thumbnail);
    formData.append("video", videoFile);

    const resultAction = await dispatch(publishVideo(formData));
    if (publishVideo.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  const displayedError = localError || error;

  return (
    <div className="pv-container animate-fade-in">
      <div className="pv-card">
        <div className="pv-header">
          <div className="pv-header-icon-wrapper">
            <FaCloudUploadAlt className="pv-header-icon" />
          </div>
          <div>
            <h1 className="pv-title">Upload Video</h1>
            <p className="pv-subtitle">Share your content with the world on VidPlay</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pv-form">
          {/* VIDEO DROPZONE */}
          <div className="pv-section">
            <label className="pv-section-label">Video File</label>
            <div className={`pv-dropzone ${videoFile ? "pv-dropzone-active" : ""}`}>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="pv-file-input"
                id="videoUpload"
              />
              <label htmlFor="videoUpload" className="pv-dropzone-inner">
                {videoFile ? (
                  <div className="pv-file-selected">
                    <FaFileVideo className="pv-selected-icon" />
                    <div>
                      <p className="pv-file-name">{videoFile.name}</p>
                      <span className="pv-file-size">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <FaCloudUploadAlt className="pv-upload-icon" />
                    <p className="pv-dropzone-text">
                      Drag &amp; drop video file or <span>Browse</span>
                    </p>
                    <span className="pv-dropzone-hint">MP4, WebM, or MOV up to 100MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* METADATA FIELDS */}
          <div className="pv-section">
            <div className="form-input-group">
              <label className="form-label" htmlFor="videoTitle">
                Title <span style={{ color: "var(--accent-primary)" }}>*</span>
              </label>
              <input
                id="videoTitle"
                type="text"
                className="form-control"
                placeholder="e.g., Building a Full-Stack Application in 2026"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setLocalError("");
                }}
                maxLength={100}
                required
              />
            </div>

            <div className="form-input-group">
              <label className="form-label" htmlFor="videoDescription">
                Description <span style={{ color: "var(--accent-primary)" }}>*</span>
              </label>
              <textarea
                id="videoDescription"
                className="form-control"
                placeholder="Tell viewers what your video is about..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setLocalError("");
                }}
                rows={4}
                required
              />
            </div>
          </div>

          {/* THUMBNAIL UPLOAD & PREVIEW */}
          <div className="pv-section">
            <label className="pv-section-label">Thumbnail</label>
            <div className="pv-thumb-layout">
              <div className="pv-thumb-picker">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="pv-file-input"
                  id="thumbUpload"
                />
                <label htmlFor="thumbUpload" className="pv-thumb-dropzone">
                  <FaImage className="pv-upload-icon" />
                  <p>Choose Thumbnail</p>
                  <span>16:9 ratio recommended</span>
                </label>
              </div>

              {thumbnailPreview && (
                <div className="pv-thumb-preview-box">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="pv-preview-img"
                  />
                  <button
                    type="button"
                    className="pv-remove-thumb-btn"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    title="Remove thumbnail"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ERROR ALERT */}
          {displayedError && (
            <div className="pv-error-alert animate-fade-in">
              {displayedError}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="pv-form-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={uploadLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary pv-submit-btn"
              disabled={uploadLoading}
            >
              {uploadLoading ? (
                <>
                  <div className="pv-spinner" />
                  <span>Uploading &amp; Processing...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Publish Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishVideo;
