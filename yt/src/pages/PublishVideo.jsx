import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublishVideo } from "../features/video/video.hooks";
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";
import "./styles/publish-video.css";

import { uploadFileToS3 } from "../utils/s3.upload";

const PublishVideo = () => {
    const navigate = useNavigate();
    const publishMutation = usePublishVideo();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !thumbnail || !videoFile) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // 1. Upload Thumbnail
            console.log("Starting thumbnail upload...");
            const thumbnailUrl = await uploadFileToS3(thumbnail, "thumbnail");
            console.log("Thumbnail upload result:", thumbnailUrl);
            if (!thumbnailUrl) throw new Error("Thumbnail upload failed - returned null");

            // 2. Upload Video
            console.log("Starting video upload...");
            const videoUrl = await uploadFileToS3(videoFile, "video");
            console.log("Video upload result:", videoUrl);
            if (!videoUrl) throw new Error("Video upload failed - returned null");

            // 3. Send Data
            const data = {
                title,
                description,
                thumbnail: thumbnailUrl,
                videoFile: videoUrl
            };

            publishMutation.mutate(data, {
                onSuccess: () => {
                    alert("Video uploaded and published successfully!");
                    navigate("/dashboard");
                },
                onError: (error) => {
                    console.error("Publish failed", error);
                    alert("Publish failed: " + (error.response?.data?.message || "Unknown error"));
                },
            });

        } catch (error) {
            console.error("Upload process failed:", error);
            alert("Failed to upload files. Please try again.");
        }
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
