import React from "react";
import "./videoCard.css";

const VideoCardSkeleton = ({ layout = "grid" }) => {
  const isCompact = layout === "compact";

  return (
    <div className={`vc-card ${isCompact ? "vc-compact" : "vc-grid"}`}>
      <div
        className="vc-thumb-wrapper skeleton"
        style={{ width: isCompact ? "140px" : "100%" }}
      />

      <div className="vc-details" style={{ width: "100%" }}>
        {!isCompact && (
          <div
            className="skeleton"
            style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0 }}
          />
        )}

        <div className="vc-meta" style={{ width: "100%", gap: "8px" }}>
          <div
            className="skeleton"
            style={{ height: "14px", width: "90%", borderRadius: "4px" }}
          />
          <div
            className="skeleton"
            style={{ height: "12px", width: "60%", borderRadius: "4px" }}
          />
          <div
            className="skeleton"
            style={{ height: "10px", width: "40%", borderRadius: "4px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
