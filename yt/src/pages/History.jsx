import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchHistory } from "../store/slices/historySlice";
import "./styles/history.css";

const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { history, loading } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchWatchHistory());
  }, [dispatch]);

  if (loading && (!history || history.length === 0)) {
    return (
      <div className="history-loading" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading watch history...</h2>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h2>Watch History</h2>

      {(!history || history.length === 0) && (
        <div className="no-history" style={{ textAlign: "center", padding: "60px 20px" }}>
          <p>You haven't watched any videos yet.</p>
        </div>
      )}

      <div className="history-grid">
        {history?.map((item, index) => {
          const video = item.video || item;
          if (!video?._id) return null;

          return (
            <div
              key={`${video._id}-${index}`}
              className="history-video-card"
              onClick={() => navigate(`/video/${video._id}`)}
              title={video.title}
            >
              <div className="history-thumb-wrapper">
                <img
                  src={video.thumbnail || "https://via.placeholder.com/320x180"}
                  alt={video.title}
                />
              </div>

              <div className="history-video-info">
                <h4>{video.title}</h4>
                <p className="history-channel-name">
                  {video.owner?.fullName || "Creator"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;