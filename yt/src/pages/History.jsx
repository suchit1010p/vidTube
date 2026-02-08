import { useNavigate } from "react-router-dom";
import { useWatchHistory } from "../features/auth/auth.hooks";
import "./styles/history.css";

const History = () => {
    const navigate = useNavigate();
    const { data: watchHistory, isLoading } = useWatchHistory();

    if (isLoading) return <div className="history-loading">Loading watch history...</div>;

    // The backend returns an array of objects where 'video' is populated.
    // Based on controller: { _id: 0, video: "$videoDetails" } where videoDetails is the video object.

    return (
        <div className="history-page">
            <h2>Watch History</h2>

            {watchHistory?.length === 0 && (
                <div className="no-history">
                    <p>You haven't watched any videos yet.</p>
                </div>
            )}

            <div className="history-grid">
                {watchHistory?.map((item, index) => {
                    // The backend aggregation creates { video: { ...videoDetails } }
                    // Let's verify structure from controller:
                    // $project: { _id: 0, video: "$videoDetails" }
                    // So item.video should be the video object.
                    const video = item.video;
                    if (!video) return null;

                    return (
                        <div
                            key={`${video._id}-${index}`}
                            className="history-video-card"
                            onClick={() => navigate(`/video/${video._id}`)}
                            title={video.title}
                        >
                            <div className="history-thumb-wrapper">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                />
                            </div>

                            <div className="history-video-info">
                                <h4>{video.title}</h4>
                                <p className="history-channel-name">{video.owner?.fullName || "Unknown Channel"}</p>
                                {/* We can add owner logic if Populate was deeper or if owner details were preserved. 
                                    Looking at controller: 
                                    $lookup from "videos" -> localField "video"
                                    Then $unwind videoDetails.
                                    The video collection usually has "owner" as ObjectId. 
                                    Does the backend populate 'owner' inside the video details lookup?
                                    
                                    Let's check `getWatchHistory` in `user.controller.js`.
                                    It does:
                                    $lookup from "videos"...
                                    It does NOT seem to lookup the "owner" of that video.
                                    So `video.owner` might just be an ID string.
                                    For now, we will handle it gracefully. 
                                */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default History;