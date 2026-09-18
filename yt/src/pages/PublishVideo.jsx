import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { publishVideo } from "../store/slices/videoSlice";
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";
import "./styles/publish-video.css";

const PublishVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const { uploadLoading, error } = useSelector((state) => state.video);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!title.trim() || !description.trim()) {
      setLocalError("Title and description are required.");
      return;
    }
    if (!thumbnail) {
      setLocalError("Please select a thumbnail image.");
      return;
    }
    if (!videoFile) {
      setLocalError("Please select a video file to upload.");
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
    <div className="publish-page">
      <div className="publish-card">
        <h2>Upload Video</h2>
        <form onSubmit={handleSubmit} className="publish-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="e.g., My Amazing Trip to Japan"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setLocalError("");
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Tell viewers about your video..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setLocalError("");
              }}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Thumbnail Image</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setThumbnail(e.target.files[0]);
                  setLocalError("");
                }}
                required
              />
              <div className="file-placeholder">
                <FaImage size={32} />
                <p>Click to select thumbnail image</p>
                {thumbnail && <p className="file-name">{thumbnail.name}</p>}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Video File</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setVideoFile(e.target.files[0]);
                  setLocalError("");
                }}
                required
              />
              <div className="file-placeholder">
                <FaCloudUploadAlt size={32} />
                <p>Click to select video file</p>
                {videoFile && <p className="file-name">{videoFile.name}</p>}
              </div>
            </div>
          </div>

          {displayedError && (
            <div className="error-message" style={{ color: "#e74c3c", marginBottom: "16px" }}>
              {displayedError}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={uploadLoading}
          >
            {uploadLoading ? "Uploading & Processing..." : "Publish Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublishVideo;
