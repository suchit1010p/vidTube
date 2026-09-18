import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addComment } from "../../store/slices/commentSlice";
import "./comment.css";

const CommentForm = ({ videoId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { submitting } = useSelector((state) => state.comment);

  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/video/${videoId}` } });
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) return;

    const resultAction = await dispatch(addComment({ videoId, content: trimmed }));
    if (addComment.fulfilled.match(resultAction)) {
      setContent("");
      setIsFocused(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setIsFocused(false);
  };

  return (
    <form className="cm-form" onSubmit={handleSubmit}>
      <img
        src={
          user?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || "Guest"}`
        }
        alt="your avatar"
        className="cm-author-avatar"
      />

      <div className="cm-form-input-container">
        <textarea
          className="cm-textarea"
          rows={isFocused || content ? 3 : 1}
          placeholder={user ? "Add a public comment..." : "Sign in to join the conversation..."}
          value={content}
          onFocus={() => {
            if (!user) {
              navigate("/login", { state: { from: `/video/${videoId}` } });
              return;
            }
            setIsFocused(true);
          }}
          onChange={(e) => setContent(e.target.value)}
        />

        {(isFocused || content) && (
          <div className="cm-form-actions animate-fade-in">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!content.trim() || submitting}
            >
              {submitting ? "Posting..." : "Comment"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
