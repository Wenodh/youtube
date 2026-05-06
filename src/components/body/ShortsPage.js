import React, { useEffect, useState, useCallback, useRef } from "react";
import { YOUTUBE_SHORTS_API } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../utils/appSlice";
import { FiThumbsUp, FiThumbsDown, FiMessageSquare, FiShare2, FiMoreVertical } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa6";

const ShortItem = ({ short, activeVideoId }) => {
  const isActive = activeVideoId === short.id.videoId;

  return (
    <div className="h-full w-full flex items-center justify-center snap-center flex-shrink-0 p-2 md:p-4">
      <div className="relative h-[95%] aspect-[9/16] overflow-hidden rounded-2xl bg-black shadow-2xl" data-video-id={short.id.videoId}>
        {/* Video Player - Only autoplay if active */}
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${short.id.videoId}?autoplay=${isActive ? 1 : 0}&loop=1&playlist=${short.id.videoId}&controls=0&modestbranding=1&rel=0`}
          title="YouTube Shorts player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        {/* Action Buttons Overlay */}
        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-6 text-white z-10">
          <div className="flex flex-col items-center">
            <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 cursor-pointer">
              <FiThumbsUp className="text-2xl" />
            </div>
            <span className="text-xs mt-1">Like</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 cursor-pointer">
              <FiThumbsDown className="text-2xl" />
            </div>
            <span className="text-xs mt-1">Dislike</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 cursor-pointer">
              <FiMessageSquare className="text-2xl" />
            </div>
            <span className="text-xs mt-1">1.2K</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 cursor-pointer">
              <FiShare2 className="text-2xl" />
            </div>
            <span className="text-xs mt-1">Share</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800/60 p-3 rounded-full hover:bg-gray-700/60 cursor-pointer">
              <FiMoreVertical className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gray-400 p-1 rounded-full">
              <FaUserTie className="text-xl" />
            </div>
            <span className="font-bold text-sm">@{short.snippet.channelTitle.replace(/\s+/g, '').toLowerCase()}</span>
            <button className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold ml-2">
              Subscribe
            </button>
          </div>
          <h3 className="line-clamp-2 text-sm leading-snug pr-12">
            {short.snippet.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

const ShortsPage = () => {
  const [shorts, setShorts] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const getShorts = useCallback(async () => {
    try {
      const res = await fetch(YOUTUBE_SHORTS_API);
      const data = await res.json();
      setShorts(data.items);
      if (data.items.length > 0) {
        setActiveVideoId(data.items[0].id.videoId);
      }
    } catch (err) {
      console.error("Failed to fetch shorts", err);
    }
  }, []);

  useEffect(() => {
    dispatch(closeMenu());
    getShorts();
  }, [dispatch, getShorts]);

  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.7,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoId = entry.target.getAttribute("data-video-id");
          setActiveVideoId(videoId);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // We need to observe the inner containers with the data-video-id
    const targets = containerRef.current?.querySelectorAll("[data-video-id]");
    targets?.forEach((target) => observer.observe(target));

    return () => {
      targets?.forEach((target) => observer.unobserve(target));
    };
  }, [shorts]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-gray-50"
    >
      {shorts?.map((short) => (
        <ShortItem
          key={short.id.videoId}
          short={short}
          activeVideoId={activeVideoId}
        />
      ))}
    </div>
  );
};

export default ShortsPage;
