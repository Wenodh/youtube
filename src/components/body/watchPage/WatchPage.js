import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu, toggleLikeVideo, addToWatchLater, addToHistory } from "../../../utils/appSlice";
import { Link, useSearchParams } from "react-router-dom";
import CommentsContainer from "./CommentsContainer";
import LiveChat from "./LiveChat";
import { YOUTUBE_VIDEOS_API, YOUTUBE_VIDEO_BY_ID } from "../../../utils/constants";
import { formatDate, formatViewCount } from "../../../utils/helperFunctions";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import { GoDownload } from "react-icons/go";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineFileDownloadDone, MdDeleteOutline } from "react-icons/md";
import { useDownloads } from "../../../hooks/useDownloads";
import { useOfflineStatus } from "../../../hooks/useOfflineStatus";
import { MdOutlineWatchLater } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";

const VideoDescription = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = video?.snippet?.description;

  return (
    <div
      className={`m-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 p-3 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
        !isExpanded ? "max-h-24 overflow-hidden" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex gap-2 font-bold mb-1">
        <span>{formatViewCount(video?.statistics?.viewCount)} views</span>
        <span>{formatDate(video?.snippet?.publishedAt)}</span>
      </div>
      <p className="whitespace-pre-wrap">
        {isExpanded ? description : description?.slice(0, 200) + "..."}
      </p>
      <button className="font-bold mt-2">
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const likedVideos = useSelector(store => store.app.likedVideos);
  const watchLater = useSelector(store => store.app.watchLater);
  const [videoInfo, setVideoInfo] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const { addDownload, removeDownload, isDownloaded, getDownload } = useDownloads();
  const isOffline = useOfflineStatus();
  const [downloaded, setDownloaded] = useState(false);

  const videoId = searchParams.get("v");

  useEffect(() => {
    const checkDownloaded = async () => {
      if (videoId) {
        const result = await isDownloaded(videoId);
        setDownloaded(result);
      }
    };
    checkDownloaded();
  }, [videoId, isDownloaded]);

  useEffect(() => {
    const getVideoInfo = async () => {
      const videoId = searchParams.get("v");
      if (!videoId) return;
      try {
        const data = await fetch(YOUTUBE_VIDEO_BY_ID + videoId);
        const json = await data.json();

        if (json?.items && json.items.length > 0) {
          setVideoInfo(json.items);
          dispatch(addToHistory(json.items[0]));
        } else {
          // Fallback to local data if offline and API returns empty/fails
          const localData = await getDownload(videoId);
          if (localData?.fullData) {
            setVideoInfo([localData.fullData]);
          }
        }
      } catch (error) {
        console.error("Error fetching video info:", error);
        if (isOffline) {
          const localData = await getDownload(videoId);
          if (localData?.fullData) {
            setVideoInfo([localData.fullData]);
          }
        }
      }
    };
    getVideoInfo();
  }, [searchParams, dispatch, isOffline, getDownload]);
  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  const [suggestionVideo, setSuggestionVideo] = useState([]);

  useEffect(() => {
    const getSubscriber = async () => {
      try {
        const data = await fetch(YOUTUBE_VIDEOS_API);
        const json = await data.json();
        setSuggestionVideo(json?.items || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestionVideo([]);
      }
    };
    getSubscriber();
  }, []);

  return (
    <div className="grid w-full grid-cols-12 p-2 md:p-4 pb-20 md:pb-4">
      <div className="col-span-full xl:col-span-9">
        {isOffline ? (
          <div className="aspect-video w-full rounded-xl bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center text-center p-4">
            <GoDownload className="text-6xl text-gray-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Video Unavailable Offline</h2>
            <p className="text-gray-500 max-w-md">
              You are currently offline. Actual video playback requires an internet connection.
            </p>
          </div>
        ) : (
          <iframe
            className="aspect-video w-full rounded-xl"
            src={`https://www.youtube.com/embed/${searchParams.get("v")}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
        {videoInfo?.map((video) => {
          return (
            <React.Fragment key={video.id}>
              {/* Subscriber Section */}
              <div className="col-span-full">
                <h1 className="m-2 overflow-hidden text-ellipsis text-xl font-bold">
                  {video?.snippet?.title}
                </h1>
                <div className="flex flex-col m-2 w-full gap-4 md:flex-row md:items-center">
                    <div className="flex items-center">
                      <FaUserTie className="rounded-full border border-gray-400 text-4xl" />
                      <ul>
                        <li className="ml-2 font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                          {video?.snippet?.channelTitle}
                        </li>
                        <li className=" ml-2 text-xs text-gray-500 dark:text-gray-400">777M Subscribers</li>
                      </ul>
                      <button className="ml-4 rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
                        Subscribe
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                      <div className="flex shrink-0 rounded-full bg-gray-100 dark:bg-gray-800">
                        <button
                          className={`flex items-center gap-2 border-r border-gray-300 dark:border-gray-700 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${likedVideos.some(v => v.id === video.id) ? 'text-blue-500' : ''}`}
                          onClick={() => dispatch(toggleLikeVideo(video))}
                        >
                          <FiThumbsUp /> {formatViewCount(video?.statistics?.likeCount)}
                        </button>
                        <button className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <FiThumbsDown />
                        </button>
                      </div>
                      <button className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <PiShareFat className="text-xl" /> Share
                      </button>
                      <button
                        className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 transition-colors ${showComments ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => setShowComments(!showComments)}
                      >
                        <FiMessageSquare className="text-xl" /> Comments
                      </button>
                      <button
                        className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 transition-colors ${watchLater.some(v => v.id === video.id) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => dispatch(addToWatchLater(video))}
                      >
                        <MdOutlineWatchLater className="text-xl" /> {watchLater.some(v => v.id === video.id) ? 'Saved' : 'Watch Later'}
                      </button>
                      <div className="relative">
                        {downloaded ? (
                          <div className="flex shrink-0 items-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <div className="flex items-center gap-2 px-3 py-2 text-blue-500 rounded-l-full border-r border-gray-300 dark:border-gray-700">
                              <MdOutlineFileDownloadDone className="text-xl" /> Downloaded
                            </div>
                            <button
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-full"
                              title="Remove download"
                              onClick={async () => {
                                if (window.confirm("Remove this video from downloads?")) {
                                  await removeDownload(video.id);
                                  setDownloaded(false);
                                }
                              }}
                            >
                              <MdDeleteOutline className="text-xl text-red-500" />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={async () => {
                              await addDownload(video);
                              setDownloaded(true);
                            }}
                          >
                            <GoDownload className="text-xl" /> Download
                          </button>
                        )}
                      </div>
                      <button className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <BsThreeDots />
                      </button>
                    </div>
                </div>
              </div>
              {/* Video Details Section */}
              <VideoDescription video={video} />

              {/* Comment Section */}
              <CommentsContainer
                videoId={searchParams.get("v")}
                isVisible={showComments}
              />
            </React.Fragment>
          );
        })}
      </div>
      <div className="col-span-full p-2 xl:col-span-3">
        <div className="hidden xl:block mb-4">
          <LiveChat />
        </div>
        <h2 className="mb-2 font-bold">Recommendations</h2>
        <div className="flex flex-col gap-2">
          {suggestionVideo?.map((info) => {
            return (
              <Link to={"?v=" + info.id} key={info.id}>
                <div className="flex gap-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
                  <img
                    className="h-24 w-40 rounded-lg object-cover"
                    src={info?.snippet?.thumbnails?.medium?.url}
                    alt="thumbnails"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight dark:text-gray-100">
                      {info?.snippet?.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {info?.snippet?.channelTitle}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatViewCount(info?.statistics?.viewCount)} views
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
