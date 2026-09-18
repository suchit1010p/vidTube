import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikedVideos } from "../store/slices/likeSlice";
import VideoCard from "../components/common/VideoCard";
import VideoCardSkeleton from "../components/common/VideoCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import { FaHeart, FaExclamationTriangle } from "react-icons/fa";
import "./styles/liked-videos.css";

const LikedVideos = () => {
  const dispatch = useDispatch();
  const { likedVideos, loading, error } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(fetchLikedVideos());
  }, [dispatch]);

  const validVideos = (likedVideos || [])
    .map((item) => item.video)
    .filter((v) => v && v._id);

  return (
    <div className="lv-container animate-fade-in">
      <div className="lv-header">
        <div className="lv-header-icon-wrapper">
          <FaHeart className="lv-header-icon" />
        </div>
        <div>
          <h1 className="lv-title">Liked Videos</h1>
          <p className="lv-subtitle">
            {validVideos.length} {validVideos.length === 1 ? "video" : "videos"} you have liked
          </p>
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
          icon={<FaHeart />}
          title="No liked videos yet"
          description="Click the like button on any video you enjoy to build your personal library."
          actionText="Explore Videos"
          onAction={() => window.location.assign("/")}
        />
      ) : (
        <div className="hm-video-grid">
          {validVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;