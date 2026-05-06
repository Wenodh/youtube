import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatViewCount } from "../../utils/helperFunctions";

const VideoCard = ({ info }) => {
  const { snippet, statistics } = info;
  const { channelTitle, title, thumbnails, publishedAt, channelId } = snippet;
  const [channelLogo, setChannelLogo] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchChannelLogo();
  }, [channelId]);

  const fetchChannelLogo = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
      );
      const data = await response.json();
      const logoUrl = data?.items[0]?.snippet?.thumbnails?.default?.url;
      if (logoUrl) {
        setChannelLogo(logoUrl);
      }
    } catch (error) {
      console.error("Error fetching channel logo:", error);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        className="aspect-video w-full rounded-lg"
        src={thumbnails.medium.url}
        alt="thumbnail"
      />
      {isHovered && (
        <iframe
          className="absolute left-0 top-0 aspect-video w-full"
          src={`https://www.youtube.com/embed/${info.id.videoId || info.id}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      <div className="flex gap-3 p-2">
        {channelLogo && (
          <Link
            className="mt-1 h-9 w-9 shrink-0"
            to={"/channel?c=" + channelTitle}
          >
            <img
              className="w-full rounded-full object-contain"
              src={channelLogo}
              alt="channelLogo"
            />
          </Link>
        )}
        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-ellipsis text-base font-bold leading-snug">
            {title}
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            <p className="hover:text-black">{channelTitle}</p>
            <p className="text-xs">
              {statistics?.viewCount && (
                <span>{formatViewCount(statistics?.viewCount)} views • </span>
              )}
              {formatDate(publishedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
