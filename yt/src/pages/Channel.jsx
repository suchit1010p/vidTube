import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannelProfile } from "../store/slices/channelSlice";
import { toggleSubscription } from "../store/slices/subscriptionSlice";
import "./styles/channel.css";
import "./styles/home.css";

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { channel, loading, error } = useSelector((state) => state.channel);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (username) {
      dispatch(fetchChannelProfile(username));
    }
  }, [dispatch, username]);

  const handleToggleSub = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/channel/${username}` } });
      return;
    }
    if (channel?._id) {
      dispatch(toggleSubscription(channel._id));
    }
  };

  if (loading && !channel) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading channel...</h2>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Channel not found</h2>
        <button
          onClick={() => navigate("/")}
          style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
        >
          Return Home
        </button>
      </div>
    );
  }

  const isOwnChannel = currentUser?._id && currentUser._id === channel._id;

  return (
    <div className="channel-page">
      <div
        className="channel-cover"
        style={{
          backgroundImage: `url(${channel.coverImage || "https://via.placeholder.com/1200x300?text=Cover"})`,
        }}
      />

      <div className="channel-header">
        <img
          src={channel.avatar || "https://via.placeholder.com/100"}
          alt={channel.username}
        />
        <div className="channel-info">
          <h2>{channel.fullName}</h2>
          <p>@{channel.username}</p>
          <p>{channel.subscribersCount || 0} subscribers</p>
        </div>

        {!isOwnChannel && (
          <button
            className={channel.isSubscribed ? "subscribed" : "subscribe"}
            onClick={handleToggleSub}
          >
            {channel.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {/* VIDEOS */}
      <div className="video-grid" style={{ marginTop: "30px" }}>
        {(!channel.videos || channel.videos.length === 0) ? (
          <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
            <p>No videos uploaded by this channel yet.</p>
          </div>
        ) : (
          channel.videos.map((video) => (
            <div
              key={video._id}
              className="video-card"
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail"
              />

              <div className="video-info" style={{ padding: "10px" }}>
                <h4>{video.title}</h4>
                <p>{video.views || 0} views</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Channel;
