const PlaylistItem = ({ playlist, videoId, onToggle }) => {
  const isAdded = playlist.videos.some((video) => (video._id || video) === videoId);

  return (
    <div className="playlist-item">
      <label>
        <input
          type="checkbox"
          checked={isAdded}
          onChange={onToggle}
        />
        {playlist.name}
      </label>
    </div>
  );
};

export default PlaylistItem;
