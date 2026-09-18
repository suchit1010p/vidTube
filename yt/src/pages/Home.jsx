import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../store/slices/videoSlice";
import "./styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const { videos, totalPages, currentPage, loading, error } = useSelector(
    (state) => state.video
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch videos when page, search, or sorting parameters change
  useEffect(() => {
    dispatch(
      fetchVideos({
        page,
        limit: 8,
        query: searchQuery || undefined,
        sortBy,
        sortType,
      })
    );
  }, [dispatch, page, searchQuery, sortBy, sortType]);

  const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.max(Math.floor(seconds), 0) + " seconds ago";
  };

  return (
    <div className="home">
      {/* SEARCH & SORT BAR */}
      <div className="home-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-btn" title="Search">🔍</button>
        </div>

        <div className="filter-wrapper">
          <select
            value={sortBy}
            onChange={(e) => {
              setPage(1);
              setSortBy(e.target.value);
            }}
          >
            <option value="createdAt">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="title">Title</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => {
              setPage(1);
              setSortType(e.target.value);
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-state" style={{ textAlign: "center", padding: "40px" }}>
          <h3>Loading videos...</h3>
        </div>
      )}

      {error && !loading && (
        <div className="error-state" style={{ textAlign: "center", padding: "40px", color: "#e74c3c" }}>
          <h3>{error}</h3>
          <button
            onClick={() =>
              dispatch(
                fetchVideos({
                  page,
                  limit: 8,
                  query: searchQuery || undefined,
                  sortBy,
                  sortType,
                })
              )
            }
            style={{ marginTop: "12px", padding: "8px 16px", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* VIDEO GRID */}
      {!loading && !error && (
        <>
          {videos.length === 0 ? (
            <div className="no-videos" style={{ textAlign: "center", padding: "60px 20px" }}>
              <h3>No videos found</h3>
              <p style={{ color: "#888", marginTop: "8px" }}>
                Try adjusting your search or upload a video to get started.
              </p>
            </div>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="video-card"
                  onClick={() => navigate(`/video/${video._id}`)}
                >
                  <div className="thumbnail-container">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <span className="duration-badge">
                      {video.duration ? (video.duration / 60).toFixed(2) : "10:00"}
                    </span>
                  </div>

                  <div className="video-details">
                    <div className="channel-avatar">
                      <img
                        src={video.owner?.avatar || "https://via.placeholder.com/40"}
                        alt="avatar"
                      />
                    </div>
                    <div className="video-meta">
                      <h4 title={video.title}>
                        {video.title.length > 50
                          ? video.title.slice(0, 50) + "..."
                          : video.title}
                      </h4>
                      <p className="channel-name">
                        {video.owner?.fullName || "Unknown Channel"}
                      </p>
                      <p className="video-stats">
                        {timeAgo(video.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
