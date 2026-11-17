import React, { useState } from "react";
import { formatDate, formatViewCount } from "../../utils/helperFunctions";

const VideoCard = ({ info, channelLogo }) => {
  const snippet = info?.snippet || {};
  const statistics = info?.statistics || {};
  const { channelTitle = "Unknown channel", title = "Untitled video", thumbnails = {}, publishedAt } = snippet;
  const videoId = info?.id?.videoId || info?.id;
  const thumbnailUrl = thumbnails.medium?.url || thumbnails.high?.url || thumbnails.default?.url;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group relative flex flex-col gap-2 transition-all duration-300" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {thumbnailUrl && <img className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" src={thumbnailUrl} alt={`Thumbnail for ${title}`} loading="lazy" decoding="async" />}
        {isHovered && videoId && (
          <iframe
            className="absolute left-0 top-0 z-10 aspect-video w-full rounded-xl"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&mute=1&controls=0&playsinline=1`}
            title={`Preview: ${title}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        )}
      </div>
      <div className="flex gap-2 p-1 sm:gap-3">
        {channelLogo ? (
          <img className="mt-1 h-7 w-7 shrink-0 rounded-full object-cover sm:h-9 sm:w-9" src={channelLogo} alt={`${channelTitle} channel avatar`} loading="lazy" />
        ) : (
          <div className="mt-1 h-7 w-7 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 sm:h-9 sm:w-9" aria-hidden="true" />
        )}
        <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
          <h3 className="line-clamp-2 text-ellipsis text-[13px] font-semibold leading-snug text-[#0f0f0f] dark:text-gray-100 sm:text-[15px]">{title}</h3>
          <div className="text-[11px] text-[#606060] dark:text-gray-400 sm:text-[13px]">
            <p className="line-clamp-1">{channelTitle}</p>
            <p className="text-[10px] sm:text-xs">
              {statistics.viewCount != null && <span>{formatViewCount(statistics.viewCount)} views • </span>}
              {publishedAt && formatDate(publishedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
