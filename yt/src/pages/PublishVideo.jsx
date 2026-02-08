import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublishVideo } from "../features/video/video.hooks";
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";
import "./styles/publish-video.css";

const PublishVideo = () => {
    const navigate = useNavigate();
    const publishMutation = usePublishVideo();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description || !thumbnail || !videoFile) {
            alert("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("thumbnail", thumbnail);
        formData.append("video", videoFile);

        publishMutation.mutate(formData, {
            onSuccess: () => {
                alert("Video started uploading! It will be available shortly.");
                navigate("/dashboard");
            },
            onError: (error) => {
                console.error("Upload failed", error);
                alert("Upload failed: " + (error.response?.data?.message || "Unknown error"));
            },
        });
    };

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
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Tell viewers about your video..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Thumbnail</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                required
                            />
                            <div className="file-placeholder">
                                <FaImage size={32} />
                                <p>Click to select thumbnail</p>
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
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                required
                            />
                            <div className="file-placeholder">
                                <FaCloudUploadAlt size={32} />
                                <p>Click to select video</p>
                                {videoFile && <p className="file-name">{videoFile.name}</p>}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={publishMutation.isPending}
                    >
                        {publishMutation.isPending ? "Uploading..." : "Publish Video"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PublishVideo;
