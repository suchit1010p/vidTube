import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos, fetchMoreVideos } from "../store/slices/videoSlice";
import VideoCard from "../components/common/VideoCard";
import VideoCardSkeleton from "../components/common/VideoCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import { FaVideoSlash, FaSearch, FaExclamationTriangle, FaCheck } from "react-icons/fa";
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

  const {
    videos,
    loading,
    loadingMore,
    error,
    loadMoreError,
    hasNextPage,
    nextPage,
  } = useSelector((state) => state.video);

  const sentinelRef = useRef(null);

  // Selected sort configuration from chips
  const currentChip = CATEGORY_CHIPS.find((c) => c.id === activeChip) || CATEGORY_CHIPS[0];

  // 1. Initial batch fetch whenever search query or category chip changes
  useEffect(() => {
    dispatch(
      fetchVideos({
        limit: 12,
        query: searchQuery || undefined,
        sortBy: currentChip.sortBy,
        sortType: currentChip.sortType,
      })
    );
  }, [dispatch, searchQuery, activeChip, currentChip.sortBy, currentChip.sortType]);

  // 2. Load more videos callback
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !loading && !loadingMore && !loadMoreError) {
      dispatch(
        fetchMoreVideos({
          limit: 12,
          query: searchQuery || undefined,
          sortBy: currentChip.sortBy,
          sortType: currentChip.sortType,
          page: nextPage,
        })
      );
    }
  }, [dispatch, hasNextPage, loading, loadingMore, loadMoreError, nextPage, searchQuery, currentChip]);

  // 3. Intersection Observer for Infinite Scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px", // Trigger slightly before reaching the bottom
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore]);

  const handleChipClick = (chip) => {
    setActiveChip(chip.id);
  };

  const handleClearSearch = () => {
    setSearchParams({});
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

      {/* INITIAL FETCH ERROR STATE */}
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

      {/* INITIAL LOADING SKELETON GRID */}
      {loading && (
        <div className="hm-video-grid">
          {Array.from({ length: 12 }).map((_, idx) => (
            <VideoCardSkeleton key={`init-skeleton-${idx}`} />
          ))}
        </div>
      )}

      {/* VIDEO CONTENT GRID */}
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
            <>
              <div className="hm-video-grid">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}

                {/* SKELETON CARDS WHILE LOADING MORE (PRESERVES EXISTING VIDEOS) */}
                {loadingMore &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <VideoCardSkeleton key={`more-skeleton-${idx}`} />
                  ))}
              </div>

              {/* RETRY BAR IF LOADING MORE FAILED */}
              {loadMoreError && (
                <div className="hm-loadmore-error animate-fade-in">
                  <span>Couldn&rsquo;t load more videos.</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleLoadMore}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* END OF LIST NOTICE */}
              {!hasNextPage && videos.length > 0 && !loadingMore && (
                <div className="hm-end-notice">
                  <div className="hm-end-divider" />
                  <span className="hm-end-text">You&rsquo;ve reached the end</span>
                  <div className="hm-end-divider" />
                </div>
              )}

              {/* INTERSECTION OBSERVER SENTINEL */}
              {hasNextPage && <div ref={sentinelRef} className="hm-sentinel" />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
