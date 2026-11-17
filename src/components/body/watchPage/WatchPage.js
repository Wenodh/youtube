import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu, toggleLikeVideo, addToWatchLater, addToHistory } from "../../../utils/appSlice";
import { Link, useSearchParams } from "react-router-dom";
import CommentsContainer from "./CommentsContainer";
import LiveChat from "./LiveChat";
import { YOUTUBE_VIDEOS_API, YOUTUBE_VIDEO_BY_ID } from "../../../utils/constants";
import { formatDate, formatViewCount } from "../../../utils/helperFunctions";
import { fetchYouTubeJson } from "../../../utils/youtubeApi";
import { FiThumbsUp, FiMessageSquare } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";

const getVideoId = (video) => video?.id?.videoId || video?.id;

const VideoDescription = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = video?.snippet?.description || "";
  const shouldCollapse = description.length > 200;

  return (
    <section className="m-2 rounded-xl bg-gray-100 p-3 text-sm dark:bg-gray-800/50">
      <div className="mb-1 flex gap-2 font-bold">
        <span>{formatViewCount(video?.statistics?.viewCount)} views</span>
        <span>{formatDate(video?.snippet?.publishedAt)}</span>
      </div>
      <p className="whitespace-pre-wrap">
        {isExpanded || !shouldCollapse ? description : `${description.slice(0, 200)}…`}
      </p>
      {shouldCollapse && (
        <button className="mt-2 font-bold" onClick={() => setIsExpanded((value) => !value)} aria-expanded={isExpanded}>
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </section>
  );
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const shouldOpenComments = searchParams.get("comments") === "1";
  const videoId = searchParams.get("v") || "";
  const dispatch = useDispatch();
  const likedVideos = useSelector((store) => store.app.likedVideos);
  const watchLater = useSelector((store) => store.app.watchLater);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(shouldOpenComments);
  const [suggestionVideos, setSuggestionVideos] = useState([]);

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    setShowComments(shouldOpenComments);
  }, [shouldOpenComments]);

  useEffect(() => {
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      setVideo(null);
      setIsLoading(false);
      setError("The video URL is missing or invalid.");
      return undefined;
    }
    const controller = new AbortController();
    const loadVideo = async () => {
      setIsLoading(true);
      setError("");
      setVideo(null);
      try {
        const data = await fetchYouTubeJson(YOUTUBE_VIDEO_BY_ID + encodeURIComponent(videoId), { signal: controller.signal, ttlMs: 300_000 });
        const nextVideo = data.items?.[0];
        if (!nextVideo) throw new Error("This video is unavailable or may have been removed.");
        if (!controller.signal.aborted) {
          setVideo(nextVideo);
          dispatch(addToHistory(nextVideo));
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message || "Unable to load this video.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    loadVideo();
    return () => controller.abort();
  }, [videoId, dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    const loadSuggestions = async () => {
      try {
        const data = await fetchYouTubeJson(YOUTUBE_VIDEOS_API, { signal: controller.signal, ttlMs: 300_000 });
        if (!controller.signal.aborted) setSuggestionVideos(data.items || []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") console.error("Error fetching recommendations:", requestError);
      }
    };
    loadSuggestions();
    return () => controller.abort();
  }, []);

  const isLiked = video && likedVideos.some((item) => getVideoId(item) === video.id);
  const isSaved = video && watchLater.some((item) => getVideoId(item) === video.id);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: video?.snippet?.title || "Watch video", url: shareUrl });
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(shareUrl);
    } catch (shareError) {
      if (shareError.name !== "AbortError") console.error("Unable to share video:", shareError);
    }
  };

  return (
    <div className="grid w-full grid-cols-12 p-2 pb-20 md:p-4 md:pb-4">
      <div className="col-span-full xl:col-span-9">
        {videoId && /^[\w-]{11}$/.test(videoId) && (
          <iframe
            className="aspect-video w-full rounded-xl bg-black"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
            title={video?.snippet?.title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
        {isLoading && <p className="p-6 text-center text-gray-500" role="status">Loading video…</p>}
        {error && <p className="m-3 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}
        {video && (
          <>
            <h1 className="m-2 overflow-hidden text-ellipsis text-xl font-bold">{video.snippet?.title}</h1>
            <div className="m-2 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex min-w-0 items-center">
                <FaUserTie className="shrink-0 rounded-full border border-gray-400 text-4xl" />
                <div className="ml-2 min-w-0">
                  <Link className="line-clamp-1 font-bold text-gray-800 hover:underline dark:text-gray-200" to={`/channel?id=${encodeURIComponent(video.snippet?.channelId || "")}`}>
                    {video.snippet?.channelTitle}
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">YouTube channel</span>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <button
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 ${isLiked ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-800"}`}
                  onClick={() => dispatch(toggleLikeVideo(video))}
                  aria-pressed={Boolean(isLiked)}
                >
                  <FiThumbsUp /> {formatViewCount(video.statistics?.likeCount)}
                </button>
                <button className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-gray-800" onClick={handleShare}>
                  <PiShareFat className="text-xl" /> Share
                </button>
                <button
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 ${showComments ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-gray-800"}`}
                  onClick={() => setShowComments((value) => !value)}
                  aria-expanded={showComments}
                >
                  <FiMessageSquare className="text-xl" /> Comments
                </button>
                <button
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 ${isSaved ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}
                  onClick={() => dispatch(addToWatchLater(video))}
                  aria-pressed={Boolean(isSaved)}
                >
                  <MdOutlineWatchLater className="text-xl" /> {isSaved ? "Saved" : "Watch Later"}
                </button>
              </div>
            </div>
            <VideoDescription video={video} />
            <CommentsContainer videoId={videoId} isVisible={showComments} />
          </>
        )}
      </div>
      <aside className="col-span-full p-2 xl:col-span-3">
        {video?.snippet?.liveBroadcastContent === "live" && <div className="mb-4 hidden xl:block"><LiveChat /></div>}
        <h2 className="mb-2 font-bold">Recommendations</h2>
        <div className="flex flex-col gap-2">
          {suggestionVideos.filter((item) => getVideoId(item) !== videoId).map((item) => {
            const recommendationId = getVideoId(item);
            return (
              <Link to={"/watch?v=" + encodeURIComponent(recommendationId)} key={recommendationId}>
                <div className="flex gap-2 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <img className="h-24 w-40 rounded-lg object-cover" src={item.snippet?.thumbnails?.medium?.url} alt={item.snippet?.title || "Video thumbnail"} loading="lazy" />
                  <div className="flex min-w-0 flex-col overflow-hidden">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight dark:text-gray-100">{item.snippet?.title}</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{item.snippet?.channelTitle}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatViewCount(item.statistics?.viewCount)} views</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

export default WatchPage;
