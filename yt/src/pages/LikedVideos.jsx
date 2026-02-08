import { useNavigate } from "react-router-dom";
import { useLikedVideos } from "../features/like/like.hooks";
import "./styles/liked-videos.css";

const LikedVideos = () => {
    const navigate = useNavigate();
    const { data: likedData, isLoading } = useLikedVideos();
    const videos = likedData?.videos || [];

    if (isLoading) return <div className="liked-loading">Loading liked videos...</div>;

    return (
        <div className="liked-videos-page">
            <h2>Liked Videos</h2>

            {videos.length === 0 && (
                <div className="no-likes">
                    <p>You haven't liked any videos yet.</p>
                </div>
            )}

            <div className="liked-videos-grid">
                {videos.map((like) => {
                    // The backend returns an array of Like objects, each populated with 'video'
                    const video = like.video;
                    if (!video) return null; // Safety check

                    return (
                        <div
                            key={like._id} // Use the like ID as key
                            className="liked-video-card"
                            onClick={() => navigate(`/video/${video._id}`)}
                            title={video.title}
                        >
                            <div className="liked-thumb-wrapper">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                />
                            </div>

                            <div className="liked-video-info">
                                <h4>{video.title}</h4>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LikedVideos;