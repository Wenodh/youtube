import React from "react";
import { FiPlay } from "react-icons/fi";
import { formatDate, formatViewCount } from "../../utils/helperFunctions";

const VideoCard = ({ info, channelLogo }) => {
  const snippet = info?.snippet || {};
  const statistics = info?.statistics || {};
  const { channelTitle = "Unknown channel", title = "Untitled video", thumbnails = {}, publishedAt } = snippet;
  const thumbnailUrl = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;

  return (
    <article className="group flex min-w-0 flex-col gap-2.5 rounded-xl focus-within:outline-none">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-shadow duration-200 group-hover:shadow-md dark:bg-[#272727]">
        {thumbnailUrl ? (
          <img
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.035]"
            src={thumbnailUrl}
            alt={`Thumbnail for ${title}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-800" aria-label="Thumbnail unavailable" />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100" aria-hidden="true">
          <span className="rounded-full bg-black/70 p-3 text-white shadow-lg"><FiPlay className="text-xl" /></span>
        </div>
      </div>
      <div className="flex min-w-0 gap-2.5 px-0.5">
        {channelLogo ? (
          <img
            className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            src={channelLogo}
            alt={`${channelTitle} channel avatar`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-200" aria-hidden="true">
            {channelTitle.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#0f0f0f] transition-colors group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300 sm:text-sm">
            {title}
          </h3>
          <div className="min-w-0 text-xs leading-relaxed text-[#606060] dark:text-gray-400">
            <p className="line-clamp-1">{channelTitle}</p>
            <p className="line-clamp-1">
              {statistics.viewCount != null && <span>{formatViewCount(statistics.viewCount)} views</span>}
              {statistics.viewCount != null && publishedAt && <span> · </span>}
              {publishedAt && formatDate(publishedAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
