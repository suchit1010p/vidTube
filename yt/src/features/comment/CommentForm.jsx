import { useState } from "react";
import { useAddComment } from "./comment.hooks";
import { useCurrentUser } from "../auth/auth.hooks";
import "./comment.css";

const CommentForm = ({ videoId }) => {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const addCommentMutation = useAddComment(videoId);
  const { data: currentUser } = useCurrentUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    addCommentMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setContent("");
          setIsFocused(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setContent("");
    setIsFocused(false);
  }

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
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
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
                disabled={addCommentMutation.isLoading || !content.trim()}
                className="comment-submit-btn"
              >
                {addCommentMutation.isLoading ? "Posting..." : "Comment"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CommentForm;
