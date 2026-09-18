import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikedVideos } from "../store/slices/likeSlice";
import "./styles/liked-videos.css";

const LikedVideos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { likedVideos, loading } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(fetchLikedVideos());
  }, [dispatch]);

  if (loading && (!likedVideos || likedVideos.length === 0)) {
    return (
      <div className="liked-loading" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading liked videos...</h2>
      </div>
    );
  }

  return (
    <div className="liked-videos-page">
      <h2>Liked Videos</h2>

      {(!likedVideos || likedVideos.length === 0) && (
        <div className="no-likes" style={{ textAlign: "center", padding: "60px 20px" }}>
          <p>You haven't liked any videos yet.</p>
        </div>
      )}

      <div className="liked-videos-grid">
        {likedVideos?.map((like) => {
          const video = like.video;
          if (!video?._id) return null;

          return (
            <div
              key={like._id || video._id}
              className="liked-video-card"
              onClick={() => navigate(`/video/${video._id}`)}
              title={video.title}
            >
              <div className="liked-thumb-wrapper">
                <img
                  src={video.thumbnail || "https://via.placeholder.com/320x180"}
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