import React, { useEffect, useState, useCallback, useRef } from "react";
import { YOUTUBE_SHORTS_API } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../utils/appSlice";
import { FiThumbsUp, FiThumbsDown, FiMessageSquare, FiShare2, FiMoreVertical } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa6";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";

const ShortItem = ({ short, isActive, isGlobalMuted, onToggleMute }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    // Initialize YouTube Player
    const player = new window.YT.Player(containerRef.current, {
      videoId: short.id.videoId,
      playerVars: {
        autoplay: isActive ? 1 : 0,
        mute: isGlobalMuted ? 1 : 0,
        loop: 1,
        playlist: short.id.videoId,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        fs: 0,
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target;
          setIsPlayerReady(true);
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [short.id.videoId]); // Only re-create if video ID changes

  useEffect(() => {
    if (isPlayerReady && playerRef.current) {
      if (isActive) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isActive, isPlayerReady]);

  useEffect(() => {
    if (isPlayerReady && playerRef.current) {
      if (isGlobalMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isGlobalMuted, isPlayerReady]);

  useEffect(() => {
    if (isActive && isGlobalMuted) {
      setShowIcon(true);
    } else if (isActive && !isGlobalMuted) {
      setShowIcon(true);
      const timer = setTimeout(() => setShowIcon(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowIcon(false);
    }
  }, [isActive, isGlobalMuted]);

  const handleContainerClick = () => {
    onToggleMute();
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="h-full w-full flex items-center justify-center snap-center flex-shrink-0 md:py-4">
      <div
        className="relative h-full w-full md:max-h-[850px] md:aspect-[9/16] md:rounded-2xl overflow-hidden bg-black shadow-2xl"
        data-video-id={short.id.videoId}
        onClick={handleContainerClick}
      >
        {/* YouTube Player Container */}
        <div ref={containerRef} className="h-full w-full pointer-events-none"></div>

        {/* Mute/Unmute Overlay */}
        {isActive && showIcon && (
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full text-white pointer-events-none transition-all duration-300 z-20 ${isGlobalMuted ? 'animate-pulse opacity-100 scale-100' : 'opacity-0 scale-125'}`}>
            {isGlobalMuted ? (
              <div className="flex flex-col items-center gap-2">
                <IoVolumeMuteOutline className="text-4xl" />
                <span className="text-sm font-medium text-center">Tap to unmute</span>
              </div>
            ) : (
              <IoVolumeHighOutline className="text-4xl" />
            )}
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-6 text-white z-10" onClick={handleActionClick}>
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
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white z-10" onClick={handleActionClick}>
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
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [apiReady, setApiReady] = useState(false);
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else {
      setApiReady(true);
    }
  }, []);

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

    const targets = containerRef.current?.querySelectorAll("[data-video-id]");
    targets?.forEach((target) => observer.observe(target));

    return () => {
      targets?.forEach((target) => observer.unobserve(target));
    };
  }, [shorts]);

  const toggleMute = () => {
    setIsGlobalMuted(!isGlobalMuted);
  };

  if (!apiReady) return null;

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] flex-grow overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-gray-50 dark:bg-[#0f0f0f]"
    >
      {shorts?.map((short) => (
        <ShortItem
          key={short.id.videoId}
          short={short}
          isActive={activeVideoId === short.id.videoId}
          isGlobalMuted={isGlobalMuted}
          onToggleMute={toggleMute}
        />
      ))}
    </div>
  );
};

export default ShortsPage;
