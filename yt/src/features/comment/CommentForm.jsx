import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addComment } from "../../store/slices/commentSlice";
import "./comment.css";

const CommentForm = ({ videoId }) => {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { submitting } = useSelector((state) => state.comment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login", { state: { from: `/video/${videoId}` } });
      return;
    }

    if (!content.trim()) return;

    const resultAction = await dispatch(
      addComment({ videoId, content: content.trim() })
    );
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
    <div className="comment-form-container">
      <img
        src={currentUser?.avatar || "https://via.placeholder.com/40"}
        alt="Avatar"
        className="comment-avatar"
      />

      <div className="comment-input-wrapper">
        <form onSubmit={handleSubmit}>
          <textarea
            className="comment-input"
            placeholder={
              currentUser
                ? "Add a public comment..."
                : "Sign in to add a comment..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => {
              if (!currentUser) {
                navigate("/login", { state: { from: `/video/${videoId}` } });
              } else {
                setIsFocused(true);
              }
            }}
            rows={isFocused ? 3 : 1}
          />

          {isFocused && (
            <div className="comment-form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="comment-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="comment-submit-btn"
              >
                {submitting ? "Posting..." : "Comment"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CommentForm;
