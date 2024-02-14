import React, { useState } from "react";

const VideoCard = ({ info }) => {
  console.log(info);
  const { snippet, statistics } = info;
  const { channelTitle, title, thumbnails, publishedAt } = snippet;
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeout;
  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => {
      setIsHovered(true);
    }, 500); // 2000 milliseconds = 2 seconds
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHovered(false);
  };

  const formatViewCount = (viewCount) => {
    if (viewCount >= 1e6) return (viewCount / 1e6).toFixed(1) + "M";
    if (viewCount >= 1e3) return (viewCount / 1e3).toFixed(1) + "K";
    return viewCount.toString();
  };

  function formatDate(publishedAt) {
    const currentDate = new Date();
    const publishedDate = new Date(publishedAt);
    const timeDifference = currentDate - publishedDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} years ago`;
    if (months > 0) return `${months} months ago`;
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return "Just now";
  }
  return (
    <div className="relative">
      <img
        className="aspect-video w-full rounded-lg"
        src={thumbnails.medium.url}
        alt="thumbnail"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          if (hoverTimeout) handleMouseLeave();
        }}
      />
      {isHovered && (
        <iframe
          // onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute left-0 top-0 aspect-video w-full rounded-lg"
          src={`https://www.youtube.com/embed/${info.id}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      <ul>
        <li>{title}</li>
        <li>{channelTitle}</li>
        <li>
          <span>
            {formatViewCount(statistics.viewCount)} views -{" "}
            {formatDate(publishedAt)}{" "}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default VideoCard;
