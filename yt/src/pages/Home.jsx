import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../store/slices/videoSlice";
import VideoCard from "../components/common/VideoCard";
import VideoCardSkeleton from "../components/common/VideoCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import { FaVideoSlash, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import "./styles/home.css";

const CATEGORY_CHIPS = [
  { id: "all", label: "All", sortBy: "createdAt", sortType: "desc" },
  { id: "latest", label: "Newest", sortBy: "createdAt", sortType: "desc" },
  { id: "views", label: "Most Viewed", sortBy: "views", sortType: "desc" },
  { id: "title", label: "By Title", sortBy: "title", sortType: "asc" },
];

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("query") || "";
  const [activeChip, setActiveChip] = useState("all");
  const [page, setPage] = useState(1);

  const { videos, totalPages, currentPage, loading, error } = useSelector(
    (state) => state.video
  );

  // Selected sort configuration from chips
  const currentChip = CATEGORY_CHIPS.find((c) => c.id === activeChip) || CATEGORY_CHIPS[0];

  useEffect(() => {
    dispatch(
      fetchVideos({
        page,
        limit: 12,
        query: searchQuery || undefined,
        sortBy: currentChip.sortBy,
        sortType: currentChip.sortType,
      })
    );
  }, [dispatch, page, searchQuery, activeChip]);

  const handleChipClick = (chip) => {
    setActiveChip(chip.id);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="hm-container">
      {/* FILTER CHIPS & ACTIVE SEARCH TAG */}
      <div className="hm-filter-bar">
        <div className="hm-chips-scroll">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.id}
              className={`hm-chip ${activeChip === chip.id ? "hm-chip-active" : ""}`}
              onClick={() => handleChipClick(chip)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="hm-search-tag">
            <FaSearch size={12} />
            <span>Search: &ldquo;{searchQuery}&rdquo;</span>
            <button
              className="hm-clear-search-btn"
              onClick={handleClearSearch}
              title="Clear search filter"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="hm-error-wrapper animate-fade-in">
          <FaExclamationTriangle className="hm-error-icon" />
          <h3>Unable to load videos</h3>
          <p>{error}</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() =>
              dispatch(
                fetchVideos({
                  page,
                  limit: 12,
                  query: searchQuery || undefined,
                  sortBy: currentChip.sortBy,
                  sortType: currentChip.sortType,
                })
              )
            }
          >
            Try Again
          </button>
        </div>
      )}

      {/* LOADING SKELETON GRID */}
      {loading && (
        <div className="hm-video-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <VideoCardSkeleton key={`skeleton-${idx}`} />
          ))}
        </div>
      )}

      {/* CONTENT GRID */}
      {!loading && !error && (
        <>
          {(!videos || videos.length === 0) ? (
            <EmptyState
              icon={<FaVideoSlash />}
              title={searchQuery ? "No matching videos found" : "No videos available yet"}
              description={
                searchQuery
                  ? "Try searching for a different keyword or explore our latest uploads."
                  : "Be the first creator to share your story on VidPlay."
              }
              actionText={searchQuery ? "Clear Search" : "Upload Video"}
              onAction={
                searchQuery
                  ? handleClearSearch
                  : () => window.location.assign("/publish-video")
              }
            />
          ) : (
            <div className="hm-video-grid">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="hm-pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>

              <span className="hm-page-indicator">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-secondary btn-sm"
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
