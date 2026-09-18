import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "../../store/slices/commentSlice";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import { formatTimeAgo } from "../../components/common/VideoCard";
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

  return (
    <div className="cm-item animate-fade-in">
      <img
        src={
          comment.owner?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${comment.owner?.username || "User"}`
        }
        alt={comment.owner?.username || "user"}
        className="cm-item-avatar"
      />

      <div className="cm-item-content">
        <div className="cm-item-header">
          <span className="cm-item-author">
            @{comment.owner?.username || "anonymous"}
          </span>
          <span className="cm-item-time">{formatTimeAgo(comment.createdAt)}</span>
        </div>

        {!isEditing ? (
          <p className="cm-item-text">{comment.content}</p>
        ) : (
          <div className="cm-edit-box">
            <textarea
              className="cm-textarea"
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="cm-edit-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleUpdate}
                disabled={!editContent.trim()}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* ACTIONS (LIKE, EDIT, DELETE) */}
        {!isEditing && (
          <div className="cm-item-actions">
            <button
              className={`cm-like-btn ${comment.isLiked ? "cm-liked" : ""}`}
              onClick={handleLike}
              title={comment.isLiked ? "Unlike" : "Like"}
            >
              <FaThumbsUp size={12} />
              <span>{comment.likesCount || 0}</span>
            </button>

            {isOwner && (
              <div className="cm-owner-actions">
                <button
                  className="cm-tool-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit comment"
                >
                  <FaEdit size={12} />
                  <span>Edit</span>
                </button>
                <button
                  className="cm-tool-btn cm-tool-delete"
                  onClick={handleDelete}
                  title="Delete comment"
                >
                  <FaTrash size={12} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
