import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { publishVideo, resetUploadState } from "../store/slices/videoSlice";
import {
  FaCloudUploadAlt,
  FaImage,
  FaFileVideo,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
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

  const {
    uploadLoading,
    uploadProgress,
    uploadStatus,
    uploadError,
  } = useSelector((state) => state.video);

  // Clean up upload state on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetUploadState());
    };
  }, [dispatch]);

  // When upload succeeds, redirect to dashboard after brief celebration
  useEffect(() => {
    if (uploadStatus === "success") {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus, navigate]);

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

    if (uploadLoading) return; // Prevent duplicate submission

    if (!videoFile) {
      setLocalError("Please select a video file to upload.");
      return;
    }
    if (!title.trim()) {
      setLocalError("Please enter a video title.");
      return;
    }
    if (!description.trim()) {
      setLocalError("Please provide a description for your video.");
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

    await dispatch(publishVideo(formData));
  };

  const handleRetry = () => {
    dispatch(resetUploadState());
    setLocalError("");
  };

  const displayedError = localError || uploadError;
  const isBusy = uploadLoading || uploadStatus === "uploading" || uploadStatus === "processing";

  return (
    <div className="pv-container animate-fade-in">
      <div className="pv-card">
        <div className="pv-header">
          <div className="pv-header-icon-wrapper">
            <FaCloudUploadAlt className="pv-header-icon" />
          </div>
          <div>
            <h1 className="pv-title">Upload Video</h1>
            <p className="pv-subtitle">
              Publish your video content to the VidPlay platform
            </p>
          </div>
        </div>

        {/* REAL-TIME PROGRESS / STAGE PANEL */}
        {isBusy && (
          <div className="pv-progress-panel animate-fade-in">
            <div className="pv-progress-header">
              <div className="pv-progress-meta">
                <FaFileVideo className="pv-progress-icon" />
                <div>
                  <h4 className="pv-progress-filename">{videoFile?.name}</h4>
                  <span className="pv-progress-filesize">
                    {videoFile?.size
                      ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : ""}
                  </span>
                </div>
              </div>

              <div className="pv-progress-percentage">
                {uploadStatus === "processing" ? (
                  <span className="pv-status-processing">Processing</span>
                ) : (
                  <span>{uploadProgress}%</span>
                )}
              </div>
            </div>

            {/* PROGRESS BAR TRACK */}
            <div className="pv-bar-track">
              <div
                className={`pv-bar-fill ${
                  uploadStatus === "processing" ? "pv-bar-indeterminate" : ""
                }`}
                style={{ width: `${Math.max(uploadProgress, 5)}%` }}
              />
            </div>

            {/* STAGE DESCRIPTION */}
            <div className="pv-stage-description">
              {uploadStatus === "uploading" && (
                <p>
                  Uploading video to server... <strong>{uploadProgress}%</strong> uploaded
                </p>
              )}
              {uploadStatus === "processing" && (
                <p className="pv-processing-text">
                  <FaSpinner className="pv-spinner-icon" /> Upload complete. Processing video &amp; generating streaming formats...
                </p>
              )}
            </div>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {uploadStatus === "success" && (
          <div className="pv-success-panel animate-fade-in">
            <FaCheckCircle className="pv-success-icon" />
            <h3>Video uploaded successfully!</h3>
            <p>Your video is ready. Redirecting to your Creator Studio...</p>
          </div>
        )}

        {/* FAILURE & RETRY PANEL */}
        {uploadStatus === "failed" && (
          <div className="pv-failed-panel animate-fade-in">
            <FaExclamationCircle className="pv-failed-icon" />
            <div>
              <h3>Upload failed</h3>
              <p>{displayedError || "Something went wrong while uploading your video."}</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        )}

        {/* UPLOAD FORM */}
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
                disabled={isBusy}
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
                    <span className="pv-dropzone-hint">
                      MP4, WebM, or MOV up to 100MB
                    </span>
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
                disabled={isBusy}
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
                disabled={isBusy}
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
                  disabled={isBusy}
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
                  {!isBusy && (
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
                  )}
                </div>
              )}
            </div>
          </div>

          {/* LOCAL ERROR ALERT */}
          {localError && !uploadLoading && uploadStatus !== "failed" && (
            <div className="pv-error-alert animate-fade-in">
              {localError}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="pv-form-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={isBusy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary pv-submit-btn"
              disabled={isBusy || !videoFile || !title.trim()}
            >
              {isBusy ? (
                <>
                  <div className="pv-spinner" />
                  <span>
                    {uploadStatus === "processing"
                      ? "Processing Video..."
                      : `Uploading (${uploadProgress}%)...`}
                  </span>
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
