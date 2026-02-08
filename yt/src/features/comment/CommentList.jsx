import { useVideoComments } from "./comment.hooks";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ videoId }) => {
  const { data: comments = [], isLoading } = useVideoComments(videoId);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>{comments.length} Comments</h3>

      <CommentForm videoId={videoId} />

      {isLoading && <p>Loading comments...</p>}

      {!isLoading &&
        comments.map((comment) => (
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
