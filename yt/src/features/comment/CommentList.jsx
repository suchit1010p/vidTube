import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../../store/slices/commentSlice";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { FaCommentAlt } from "react-icons/fa";
import "./comment.css";

const CommentList = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comment);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [dispatch, videoId]);

  return (
    <div className="cm-container">
      {/* HEADER */}
      <div className="cm-header">
        <h3 className="cm-heading">
          {comments?.length || 0} {comments?.length === 1 ? "Comment" : "Comments"}
        </h3>
      </div>

      {/* INPUT FORM */}
      <CommentForm videoId={videoId} />

      {/* COMMENTS LIST */}
      <div className="cm-list">
        {loading && (!comments || comments.length === 0) ? (
          <div className="cm-loading">Loading comments...</div>
        ) : (!comments || comments.length === 0) ? (
          <div className="cm-empty">
            <FaCommentAlt className="cm-empty-icon" />
            <p>No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              videoId={videoId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
