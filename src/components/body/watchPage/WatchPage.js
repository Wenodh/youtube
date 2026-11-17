import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu, toggleLikeVideo, addToWatchLater, addToHistory } from "../../../utils/appSlice";
import { Link, useSearchParams } from "react-router-dom";
import CommentsContainer from "./CommentsContainer";
import LiveChat from "./LiveChat";
import { YOUTUBE_RELATED_SEARCH_API, YOUTUBE_VIDEO_BY_ID } from "../../../utils/constants";
import { formatDate, formatViewCount } from "../../../utils/helperFunctions";
import { fetchYouTubeJson } from "../../../utils/youtubeApi";
import { buildRecommendationQuery, getRecommendationVideoId, rankRecommendations } from "../../../utils/recommendations";
import { dismissRecommendation, getDismissedRecommendations } from "../../../utils/recommendationStorage";
import { FiThumbsUp, FiMessageSquare, FiX } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";

const getVideoId = (video) => video?.id?.videoId || video?.id;

const VideoDescription = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = video?.snippet?.description || "";
  const shouldCollapse = description.length > 200;

  return (
    <section className="mx-1 mt-4 rounded-2xl bg-gray-100 p-4 text-sm dark:bg-[#202020]">
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
  const history = useSelector((store) => store.app.history);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(shouldOpenComments);
  const [suggestionVideos, setSuggestionVideos] = useState([]);
  const [candidateVideos, setCandidateVideos] = useState([]);
  const [candidateVideoId, setCandidateVideoId] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [dismissedIds, setDismissedIds] = useState(getDismissedRecommendations);

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

  // Fetch candidates for the active video; preference changes re-rank this pool locally.
  useEffect(() => {
    if (!video?.id) {
      setCandidateVideos([]); setCandidateVideoId(""); setSuggestionVideos([]);
      setIsLoadingSuggestions(false); return undefined;
    }
    const controller = new AbortController();
    const loadCandidates = async () => {
      setIsLoadingSuggestions(true); setSuggestionError("");
      setCandidateVideos([]); setCandidateVideoId("");
      try {
        const url = new URL(YOUTUBE_RELATED_SEARCH_API);
        url.searchParams.set("q", buildRecommendationQuery(video));
        const data = await fetchYouTubeJson(url.toString(), { signal: controller.signal, ttlMs: 600_000 });
        if (!controller.signal.aborted) { setCandidateVideos(data.items || []); setCandidateVideoId(video.id); }
      } catch (requestError) {
        if (requestError.name !== "AbortError") setSuggestionError(requestError.message || "Unable to load relevant recommendations.");
      } finally { if (!controller.signal.aborted) setIsLoadingSuggestions(false); }
    };
    loadCandidates(); return () => controller.abort();
  }, [video?.id]);

  useEffect(() => {
    if (!candidateVideos.length || candidateVideoId !== video?.id) { setSuggestionVideos([]); return; }
    setSuggestionVideos(rankRecommendations(candidateVideos, { currentVideo: video, history, likedVideos, dismissedIds }));
  }, [candidateVideos, candidateVideoId, video, history, likedVideos, dismissedIds]);

  const handleDismissRecommendation = (recommendationId) => {
    setDismissedIds(dismissRecommendation(recommendationId));
    setSuggestionVideos((previous) => previous.filter((item) => getRecommendationVideoId(item) !== recommendationId));
  };
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
    <div className="mx-auto grid w-full max-w-[1900px] grid-cols-12 gap-x-4 p-2 pb-24 sm:p-4 md:pb-6 xl:gap-x-6">
      <div className="col-span-full xl:col-span-9">
        {videoId && /^[\w-]{11}$/.test(videoId) && (
          <iframe
            className="aspect-video w-full rounded-2xl bg-black shadow-sm"
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
            <h1 className="mx-1 mb-3 mt-4 line-clamp-2 text-lg font-bold leading-snug tracking-tight sm:text-xl">{video.snippet?.title}</h1>
            <div className="mx-1 flex flex-col gap-3 border-b border-gray-100 pb-3 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center">
                <FaUserTie className="shrink-0 rounded-full border border-gray-400 text-4xl" />
                <div className="ml-2 min-w-0">
                  <Link className="line-clamp-1 font-bold text-gray-800 hover:underline dark:text-gray-200" to={`/channel?id=${encodeURIComponent(video.snippet?.channelId || "")}`}>
                    {video.snippet?.channelTitle}
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">YouTube channel</span>
                </div>
              </div>
              <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 ${isLiked ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-800"}`}
                  onClick={() => dispatch(toggleLikeVideo(video))}
                  aria-pressed={Boolean(isLiked)}
                  title="Local preference only — this does not like the video on YouTube"
                >
                  <FiThumbsUp /> {isLiked ? "Liked locally" : "Like locally"}
                </button>
                <span className="shrink-0 text-xs text-gray-500">{formatViewCount(video.statistics?.likeCount)} YouTube likes</span>
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
      <aside className="col-span-full mt-5 p-1 xl:col-span-3 xl:mt-0 xl:pt-0">
        {video?.snippet?.liveBroadcastContent === "live" && <div className="mb-4 hidden xl:block"><LiveChat /></div>}
        <h2 className="mb-1 text-lg font-bold tracking-tight">Related to this video</h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Topic-aware, personalized picks with duplicate-content filtering</p>
        {isLoadingSuggestions && <p className="py-4 text-sm text-gray-500" role="status">Finding relevant videos…</p>}
        {suggestionError && <p className="py-3 text-sm text-red-600 dark:text-red-400" role="alert">{suggestionError}</p>}
        {!isLoadingSuggestions && !suggestionError && suggestionVideos.length === 0 && <p className="py-3 text-sm text-gray-500">No close matches found. Try another video to refresh your recommendations.</p>}
        <div className="flex flex-col gap-2">
          {suggestionVideos.map((item) => {
            const recommendationId = getVideoId(item);
            return (
              <div key={recommendationId} className="group flex gap-2 rounded-xl p-2 transition-colors hover:bg-gray-100 dark:hover:bg-[#202020]">
                <Link className="flex min-w-0 flex-1 gap-3" to={"/watch?v=" + encodeURIComponent(recommendationId)}>
                  <img className="h-24 w-40 shrink-0 rounded-xl bg-gray-100 object-cover sm:w-44" src={item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url} alt={item.snippet?.title || "Video thumbnail"} loading="lazy" />
                  <div className="flex min-w-0 flex-col overflow-hidden">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">{item.snippet?.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{item.snippet?.channelTitle}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(item.snippet?.publishedAt)}</p>
                  </div>
                </Link>
                <button type="button" className="h-8 w-8 shrink-0 rounded-full text-gray-500 opacity-70 hover:bg-gray-200 hover:text-black focus:opacity-100 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => handleDismissRecommendation(recommendationId)} aria-label={`Not interested in ${item.snippet?.title || "this video"}`} title="Not interested"><FiX className="mx-auto" /></button>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

export default WatchPage;
