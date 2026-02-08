import { useState } from "react";
import { useUpdateComment, useDeleteComment } from "./comment.hooks";
import { useToggleCommentLike } from "../like/like.hooks";
import { useCurrentUser } from "../auth/auth.hooks";
import { FaThumbsUp, FaTrash, FaEdit } from "react-icons/fa";
import "./comment.css";

const CommentItem = ({ comment, videoId }) => {
  const { data: currentUser } = useCurrentUser();
  const isOwner = currentUser?._id === comment.owner?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const updateMutation = useUpdateComment(videoId);
  const deleteMutation = useDeleteComment(videoId);
  const likeMutation = useToggleCommentLike(videoId);

  const handleUpdate = () => {
    updateMutation.mutate(
      { commentId: comment._id, data: { content: editContent } },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="comment-item">
      <img
        src={comment.owner?.avatar || "https://via.placeholder.com/40"}
        alt="User"
        className="comment-avatar"
      />

      <div className="comment-content-wrapper">
        <div className="comment-header">
          <span className="comment-author">@{comment.owner?.username}</span>
          <span className="comment-date">{timeAgo(comment.createdAt)}</span>
        </div>

        {!isEditing ? (
          <p className="comment-text">{comment.content}</p>
        ) : (
          <div className="comment-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              className="comment-edit-input"
            />
            <div className="comment-form-actions">
              <button
                className="comment-cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="comment-submit-btn"
                onClick={handleUpdate}
                disabled={!editContent.trim()}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Actions Row (Like, Reply, Edit/Delete) */}
        {!isEditing && (
          <div className="comment-actions">
            <button
              className="comment-like-btn"
              onClick={() => likeMutation.mutate(comment._id)}
            >
              <FaThumbsUp size={14} className={comment.isLiked ? "icon-liked" : ""} />
              <span>{comment.likesCount || 0}</span>
            </button>

            {isOwner && (
              <>
                <button
                  className="comment-action-text-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="comment-action-text-btn"
                  onClick={() => deleteMutation.mutate(comment._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
