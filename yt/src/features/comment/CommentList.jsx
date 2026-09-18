import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../../store/slices/commentSlice";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comment);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [dispatch, videoId]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>{(comments || []).length} Comments</h3>

      <CommentForm videoId={videoId} />

      {loading && <p style={{ padding: "12px 0" }}>Loading comments...</p>}

      {!loading && (comments || []).length === 0 && (
        <p style={{ color: "#888", padding: "16px 0" }}>No comments yet. Be the first to comment!</p>
      )}

      {!loading &&
        (comments || []).map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            videoId={videoId}
          />
        ))}
    </div>
  );
};

export default CommentList;
