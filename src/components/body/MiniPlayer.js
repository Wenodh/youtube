import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deactivateMiniPlayer } from "../../utils/miniPlayerSlice";
import { IoCloseOutline, IoPauseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MiniPlayer = () => {
  const { isActive, videoId, videoInfo } = useSelector((store) => store.miniPlayer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isActive || !videoId) return null;

  return (
    <>
      {/* Desktop MiniPlayer */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex w-96 flex-col shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="relative aspect-video group cursor-pointer" onClick={() => navigate(`/watch?v=${videoId}`)}>
          <iframe
            className="h-full w-full pointer-events-none"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`}
            title="Miniplayer video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>

          {/* Overlay */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors flex items-start justify-end p-2">
              <button
                  onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deactivateMiniPlayer());
                  }}
                  className="bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                  <IoCloseOutline className="text-xl" />
              </button>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between gap-2" onClick={() => navigate(`/watch?v=${videoId}`)}>
          <div className="flex-1 overflow-hidden cursor-pointer">
            <h3 className="font-bold text-sm line-clamp-1 dark:text-gray-100">
              {videoInfo?.snippet?.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {videoInfo?.snippet?.channelTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile MiniPlayer - Bottom Bar Style */}
      <div
        className="fixed bottom-[50px] left-0 right-0 z-40 flex md:hidden items-center bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-14"
        onClick={() => navigate(`/watch?v=${videoId}`)}
      >
        <div className="w-32 h-full relative flex-shrink-0">
          <iframe
            className="h-full w-full pointer-events-none"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`}
            title="Miniplayer video mobile"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
          <div className="absolute inset-0 bg-transparent"></div>
        </div>
        <div className="flex-1 px-3 min-w-0">
          <h3 className="text-sm font-medium line-clamp-1 dark:text-gray-100">
            {videoInfo?.snippet?.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {videoInfo?.snippet?.channelTitle}
          </p>
        </div>
        <div className="flex items-center px-2 gap-4">
          <button onClick={(e) => { e.stopPropagation(); /* Toggle Play would go here */ }}>
            <IoPauseOutline className="text-2xl dark:text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(deactivateMiniPlayer());
            }}
          >
            <IoCloseOutline className="text-2xl dark:text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
