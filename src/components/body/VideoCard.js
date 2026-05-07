import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatViewCount } from "../../utils/helperFunctions";

const VideoCard = ({ info }) => {
  const { snippet, statistics } = info;
  const { channelTitle, title, thumbnails, publishedAt, channelId } = snippet;
  const [channelLogo, setChannelLogo] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
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
    fetchChannelLogo();
  }, [channelId]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="group relative flex flex-col gap-2 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-xl">
      <img
        className="aspect-video w-full transition-transform duration-500 group-hover:scale-105"
        src={thumbnails.medium.url}
        alt="thumbnail"
      />
      {isHovered && (
        <iframe
          className="absolute left-0 top-0 z-10 aspect-video w-full rounded-xl"
          src={`https://www.youtube.com/embed/${info.id.videoId || info.id}?autoplay=1&mute=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
      </div>
      <div className="flex gap-2 p-1 sm:gap-3">
        {channelLogo && (
          <Link
            className="mt-1 h-7 w-7 shrink-0 sm:h-9 sm:w-9"
            to={"/channel?c=" + channelTitle}
          >
            <img
              className="w-full rounded-full object-contain"
              src={channelLogo}
              alt="channelLogo"
            />
          </Link>
        )}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h3 className="line-clamp-2 text-ellipsis text-[13px] font-semibold leading-snug text-[#0f0f0f] dark:text-gray-100 sm:text-[15px]">
            {title}
          </h3>
          <div className="text-[11px] text-[#606060] dark:text-gray-400 sm:text-[13px]">
            <p className="hover:text-black dark:hover:text-white line-clamp-1">{channelTitle}</p>
            <p className="text-[10px] sm:text-xs">
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
