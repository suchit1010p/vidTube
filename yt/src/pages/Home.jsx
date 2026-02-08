import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAllVideos } from "../features/video/video.hooks";
import "./styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const { data, isLoading, isError } = useAllVideos({
    page,
    limit: 8,
    query: searchQuery || undefined,
    sortBy,
    sortType,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  if (isLoading) {
    return <h2>Loading videos...</h2>;
  }

  if (isError) {
    return <h2>Failed to load videos</h2>;
  }

  // Simple time ago helper
  const timeAgo = (date) => {
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
    return Math.floor(seconds) + " seconds ago";
  };

  const {
    videos = [],
    totalPages = 1,
    currentPage = 1,
  } = data || {};

  return (
    <div className="home">
      {/* SEARCH & SORT BAR */}
      <div className="home-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="filter-wrapper">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="title">Title</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* VIDEO GRID */}
      <div className="video-grid">
        {videos.length === 0 && (
          <p className="no-videos">No videos found</p>
        )}

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
              <span className="duration-badge">{video.duration ? (video.duration / 60).toFixed(2) : "10:00"}</span>
            </div>

            <div className="video-details">
              <div className="channel-avatar">
                <img src={video.owner?.avatar || "https://via.placeholder.com/40"} alt="avatar" />
              </div>
              <div className="video-meta">
                <h4 title={video.title}>
                  {video.title.length > 50 ? video.title.slice(0, 50) + "..." : video.title}
                </h4>
                <p className="channel-name">{video.owner?.fullName || "Unknown Channel"}</p>
                <p className="video-stats">
                  {timeAgo(video.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
