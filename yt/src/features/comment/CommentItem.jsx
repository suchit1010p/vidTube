import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "../../store/slices/commentSlice";
import { FaThumbsUp } from "react-icons/fa";
import "./comment.css";

const CommentItem = ({ comment, videoId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const isOwner = currentUser?._id && currentUser._id === comment.owner?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    const resultAction = await dispatch(
      updateComment({ commentId: comment._id, content: editContent.trim() })
    );
    if (updateComment.fulfilled.match(resultAction)) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await dispatch(deleteComment(comment._id));
    }
  };

  const handleLike = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/video/${videoId}` } });
      return;
    }
    dispatch(toggleCommentLike(comment._id));
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

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
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
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

        {/* Actions Row (Like, Edit, Delete) */}
        {!isEditing && (
          <div className="comment-actions">
            <button
              className="comment-like-btn"
              onClick={handleLike}
              title={comment.isLiked ? "Unlike" : "Like"}
            >
              <FaThumbsUp
                size={14}
                className={comment.isLiked ? "icon-liked" : ""}
              />
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
                  onClick={handleDelete}
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
