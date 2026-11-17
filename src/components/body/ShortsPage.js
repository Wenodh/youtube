import React, { useEffect, useState, useCallback, useRef } from "react";
import { YOUTUBE_SHORTS_API } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../utils/appSlice";
import { FiThumbsUp, FiThumbsDown, FiMessageSquare, FiShare2, FiMoreVertical } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa6";
import { IoVolumeHighOutline, IoVolumeMuteOutline, IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ShortItem = ({ short, isActive, isGlobalMuted, onToggleMute }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    let disposed = false;
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
        disablekb: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          if (disposed) {
            event.target.destroy();
            return;
          }
          playerRef.current = event.target;
          setIsPlayerReady(true);
        },
      },
    });
    playerRef.current = player;

    return () => {
      disposed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsPlayerReady(false);
    };
    // Player instance is tied to this video ID; active/mute state is handled by separate effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [short.id.videoId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        {/* Touch/Interaction blocker to prevent native controls from showing */}
        <div className="absolute inset-0 z-0 bg-black/0"></div>

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
  const [apiError, setApiError] = useState("");
  const [shortsError, setShortsError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.YT?.Player) {
      setApiReady(true);
      return undefined;
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    const script = existingScript || document.createElement("script");
    const previousCallback = window.onYouTubeIframeAPIReady;
    let disposed = false;
    const handleReady = () => {
      if (!disposed) setApiReady(Boolean(window.YT?.Player));
      if (typeof previousCallback === "function") previousCallback();
    };
    window.onYouTubeIframeAPIReady = handleReady;
    if (!existingScript) {
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        if (!disposed) setApiError("Unable to load the YouTube player. Check your connection and retry.");
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener("error", () => {
        if (!disposed) setApiError("Unable to load the YouTube player. Check your connection and retry.");
      }, { once: true });
    }

    return () => {
      disposed = true;
      if (window.onYouTubeIframeAPIReady === handleReady) {
        window.onYouTubeIframeAPIReady = previousCallback || null;
      }
    };
  }, []);

  const getShorts = useCallback(async (signal) => {
    try {
      setShortsError("");
      const res = await fetch(YOUTUBE_SHORTS_API, { signal });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error?.message || "Unable to load Shorts.");
      const items = (data.items || []).filter((item) => item?.id?.videoId);
      if (!signal?.aborted) {
        setShorts(items);
        setActiveVideoId(items[0]?.id?.videoId || null);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setShortsError(err.message || "Failed to fetch Shorts.");
        console.error("Failed to fetch shorts:", err);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(closeMenu());
    const controller = new AbortController();
    getShorts(controller.signal);
    return () => controller.abort();
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
      observer.disconnect();
    };
  }, [shorts]);

  const toggleMute = () => {
    setIsGlobalMuted(!isGlobalMuted);
  };

  if (apiError) return <p className="p-8 text-center text-red-500" role="alert">{apiError}</p>;
  if (!apiReady) return <p className="p-8 text-center text-gray-500" role="status">Loading Shorts player…</p>;

  return (
    <div
      ref={containerRef}
      className="h-screen md:h-[calc(100vh-72px)] flex-grow overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-gray-50 dark:bg-[#0f0f0f] relative"
    >
      {shortsError && <p className="absolute left-4 right-4 top-16 z-40 rounded-lg bg-red-950/80 p-3 text-sm text-white" role="alert">{shortsError}</p>}
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm md:hidden"
      >
        <IoArrowBackOutline className="text-2xl" />
      </button>

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
