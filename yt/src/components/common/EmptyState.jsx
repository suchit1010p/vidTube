import React from "react";
import "./emptyState.css";

const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div className={`empty-state-container animate-fade-in ${className}`}>
      <div className="empty-state-icon-wrapper">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionText && onAction && (
        <button className="btn btn-primary empty-state-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
