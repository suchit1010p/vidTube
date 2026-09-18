import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchHistory } from "../store/slices/historySlice";
import VideoCard from "../components/common/VideoCard";
import VideoCardSkeleton from "../components/common/VideoCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import { FaHistory } from "react-icons/fa";
import "./styles/history.css";

const History = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchWatchHistory());
  }, [dispatch]);

  const validVideos = (history || [])
    .map((item) => item.video || item)
    .filter((v) => v && v._id);

  return (
    <div className="hs-container animate-fade-in">
      <div className="hs-header">
        <div className="hs-header-icon-wrapper">
          <FaHistory className="hs-header-icon" />
        </div>
        <div>
          <h1 className="hs-title">Watch History</h1>
          <p className="hs-subtitle">Videos you have previously watched on VidPlay</p>
        </div>
      </div>

      {error && (
        <div className="pv-error-alert" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {loading && (!validVideos || validVideos.length === 0) ? (
        <div className="hm-video-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : validVideos.length === 0 ? (
        <EmptyState
          icon={<FaHistory />}
          title="No watch history"
          description="Videos that you watch will automatically be recorded here for easy rewatching."
          actionText="Browse Home"
          onAction={() => window.location.assign("/")}
        />
      ) : (
        <div className="hm-video-grid">
          {validVideos.map((video, idx) => (
            <VideoCard key={`${video._id}-${idx}`} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;