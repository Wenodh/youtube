import React, { useEffect, useState, useCallback } from "react";
import { YOUTUBE_SHORTS_API } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../utils/appSlice";

const ShortsPage = () => {
  const [shorts, setShorts] = useState([]);
  const dispatch = useDispatch();

  const getShorts = useCallback(async () => {
    try {
      const res = await fetch(YOUTUBE_SHORTS_API);
      const data = await res.json();
      setShorts(data.items);
    } catch (err) {
      console.error("Failed to fetch shorts", err);
    }
  }, []);

  useEffect(() => {
    dispatch(closeMenu());
    getShorts();
  }, [dispatch, getShorts]);

  return (
    <div className="flex w-full flex-col items-center gap-4 overflow-y-auto p-4 pb-24 md:pb-4">
      {shorts?.map((short) => (
        <div
          key={short.id.videoId}
          className="relative aspect-[9/16] w-full max-w-[400px] snap-start overflow-hidden rounded-2xl bg-black shadow-lg"
        >
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${short.id.videoId}?autoplay=1&mute=1&loop=1&playlist=${short.id.videoId}&controls=0&modestbranding=1&rel=0`}
            title="YouTube Shorts player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <h3 className="line-clamp-2 text-sm font-bold">
              {short.snippet.title}
            </h3>
            <p className="text-xs text-gray-300">
              {short.snippet.channelTitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShortsPage;
