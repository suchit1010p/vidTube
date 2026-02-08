import { useParams, useNavigate } from "react-router-dom";
import {
  useChannelProfile,
  useToggleSubscription
} from "../features/channel/channel.hooks";
import { useCurrentUser } from "../features/auth/auth.hooks";
import "./styles/channel.css";
import "./styles/home.css";

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate(); // ✅ FIX

  const { data: channel, isLoading } = useChannelProfile(username);
  const { data: currentUser } = useCurrentUser();

  const toggleSub = useToggleSubscription(channel?._id);

  if (isLoading) return <h2>Loading channel...</h2>;
  if (!channel) return <h2>Channel not found</h2>;

  const isOwnChannel = currentUser?._id === channel._id;

  return (
    <div className="channel-page">
      <div
        className="channel-cover"
        style={{ backgroundImage: `url(${channel.coverImage})` }}
      />

      <div className="channel-header">
        <img src={channel.avatar} alt="avatar" />
        <div className="channel-info">
          <h2>{channel.fullName}</h2>
          <p>@{channel.username}</p>
          <p>{channel.subscribersCount} subscribers</p>
        </div>

        {!isOwnChannel && (
          <button
            className={channel.isSubscribed ? "subscribed" : "subscribe"}
            onClick={() => toggleSub.mutate()}
          >
            {channel.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {/* VIDEOS */}
      <div className="video-grid">
        {channel.videos.length === 0 && <p>No videos found</p>}

        {channel.videos.map((video) => (
          <div
            key={video._id}
            className="video-card"
            onClick={() => navigate(`/video/${video._id}`)} // ✅ WORKS NOW
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="video-thumbnail"
            />

            <div className="video-info">
              <h4>{video.title}</h4>
              <p>{video.views || 0} views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channel;
