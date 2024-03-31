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
          src={`https://www.youtube.com/embed/${info.id}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      <div className="flex gap-2 p-2">
        {channelLogo && (
          <Link
            className="mt-2 min-w-9 max-w-9"
            to={"/channel?c=" + channelTitle}
          >
            <img
              className="w-full rounded-full object-contain"
              src={channelLogo}
              alt="channelLogo"
            />
          </Link>
        )}
        <ul>
          <li className="line-clamp-2 text-ellipsis text-lg font-medium">
            {title}
          </li>
          <li className="text-sm font-normal text-gray-600">{channelTitle}</li>
          <li className="text-xs font-normal text-gray-600">
            <span>
              {formatViewCount(statistics.viewCount)} views -{" "}
              {formatDate(publishedAt)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VideoCard;
