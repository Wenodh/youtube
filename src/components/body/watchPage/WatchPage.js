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
import { FiThumbsUp, FiMessageSquare, FiX, FiShare2, FiBookmark, FiPlay } from "react-icons/fi";

const getVideoId = (video) => video?.id?.videoId || video?.id;

const ActionButton = ({ active, onClick, label, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    title={title}
    className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
      active
        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#272727] dark:text-gray-100 dark:hover:bg-[#353535]"
    }`}
  >
    {children}
    <span>{label}</span>
  </button>
);

const VideoDescription = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = video?.snippet?.description || "";
  const shouldCollapse = description.length > 220;

  return (
    <section className="mt-4 rounded-2xl bg-gray-100 p-4 text-sm dark:bg-[#202020]" aria-label="Video details">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-gray-700 dark:text-gray-300 sm:text-sm">
        <span>{formatViewCount(video?.statistics?.viewCount)} views</span>
        <span>{formatDate(video?.snippet?.publishedAt)}</span>
      </div>
      {description ? (
        <p className={`whitespace-pre-wrap break-words leading-relaxed text-gray-800 dark:text-gray-200 ${isExpanded ? "" : "line-clamp-3"}`}>
          {description}
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No description provided.</p>
      )}
      {shouldCollapse && (
        <button
          type="button"
          className="mt-3 rounded-md font-bold text-gray-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-white"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </section>
  );
};

const RecommendationCard = ({ item, onDismiss }) => {
  const recommendationId = getVideoId(item);
  const snippet = item.snippet || {};
  const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-[#202020]">
      <Link
        className="flex h-full min-w-0 flex-col gap-2 p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:flex-row xl:gap-3"
        to={"/watch?v=" + encodeURIComponent(recommendationId)}
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 xl:aspect-video xl:w-40">
          {thumbnail ? (
            <img
              className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
              src={thumbnail}
              alt={snippet.title ? `Thumbnail for ${snippet.title}` : "Recommended video thumbnail"}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-800" aria-label="Thumbnail unavailable" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100" aria-hidden="true">
            <span className="rounded-full bg-black/70 p-2"><FiPlay className="text-lg" /></span>
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col py-0.5 pr-1">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300 sm:text-sm">
            {snippet.title || "Untitled video"}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{snippet.channelTitle || "Unknown channel"}</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">{formatDate(snippet.publishedAt)}</p>
        </div>
      </Link>
      <button
        type="button"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white opacity-100 shadow-sm transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:opacity-0 xl:group-hover:opacity-100"
        onClick={() => onDismiss(recommendationId)}
        aria-label={`Not interested in ${snippet.title || "this video"}`}
        title="Not interested"
      >
        <FiX />
      </button>
    </article>
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

  useEffect(() => { dispatch(closeMenu()); }, [dispatch]);
  useEffect(() => { setShowComments(shouldOpenComments); }, [shouldOpenComments]);

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
    if (!video?.id) {
      setCandidateVideos([]);
      setCandidateVideoId("");
      setSuggestionVideos([]);
      setIsLoadingSuggestions(false);
      return undefined;
    }
    const controller = new AbortController();
    const loadCandidates = async () => {
      setIsLoadingSuggestions(true);
      setSuggestionError("");
      setCandidateVideos([]);
      setCandidateVideoId("");
      try {
        const url = new URL(YOUTUBE_RELATED_SEARCH_API);
        url.searchParams.set("q", buildRecommendationQuery(video));
        const data = await fetchYouTubeJson(url.toString(), { signal: controller.signal, ttlMs: 600_000 });
        if (!controller.signal.aborted) {
          setCandidateVideos(data.items || []);
          setCandidateVideoId(video.id);
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") setSuggestionError(requestError.message || "Unable to load relevant recommendations.");
      } finally {
        if (!controller.signal.aborted) setIsLoadingSuggestions(false);
      }
    };
    loadCandidates();
    return () => controller.abort();
  }, [video?.id]);

  useEffect(() => {
    if (!candidateVideos.length || candidateVideoId !== video?.id) {
      setSuggestionVideos([]);
      return;
    }
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
    <main className="mx-auto grid w-full max-w-[1900px] grid-cols-12 gap-x-4 px-2 pb-24 pt-2 sm:px-4 md:pb-8 xl:gap-x-6 xl:pt-4">
      <section className="col-span-full min-w-0 xl:col-span-9" aria-label="Video player and details">
        {videoId && /^[\w-]{11}$/.test(videoId) && (
          <div className="overflow-hidden rounded-xl bg-black shadow-sm sm:rounded-2xl">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
              title={video?.snippet?.title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
        {isLoading && <p className="p-6 text-center text-gray-500" role="status">Loading video…</p>}
        {error && <p className="m-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}
        {video && (
          <>
            <h1 className="mb-3 mt-4 px-1 text-lg font-bold leading-snug tracking-tight text-gray-950 dark:text-white sm:text-xl lg:text-2xl">
              {video.snippet?.title}
            </h1>
            <div className="flex flex-col gap-3 border-b border-gray-200 px-1 pb-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <Link
                className="flex min-w-0 items-center gap-3 rounded-lg py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                to={`/channel?id=${encodeURIComponent(video.snippet?.channelId || "")}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-100" aria-hidden="true">
                  {(video.snippet?.channelTitle || "C").slice(0, 1).toUpperCase()}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="line-clamp-1 font-bold text-gray-900 dark:text-gray-100">{video.snippet?.channelTitle || "Unknown channel"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">View channel</span>
                </span>
              </Link>
              <div className="flex max-w-full flex-wrap items-center gap-2">
                <ActionButton active={Boolean(isLiked)} label={isLiked ? "Liked" : "Like"} title="Local preference only — this does not like the video on YouTube" onClick={() => dispatch(toggleLikeVideo(video))}>
                  <FiThumbsUp />
                </ActionButton>
                <ActionButton label="Share" onClick={handleShare}><FiShare2 /></ActionButton>
                <ActionButton active={showComments} label="Comments" onClick={() => setShowComments((value) => !value)}>
                  <FiMessageSquare />
                </ActionButton>
                <ActionButton active={Boolean(isSaved)} label={isSaved ? "Saved" : "Watch later"} onClick={() => dispatch(addToWatchLater(video))}>
                  <FiBookmark />
                </ActionButton>
              </div>
            </div>
            <VideoDescription video={video} />
            <div className="mt-6">
              <CommentsContainer videoId={videoId} isVisible={showComments} />
            </div>
          </>
        )}
      </section>

      <aside className="col-span-full mt-7 min-w-0 xl:col-span-3 xl:mt-0" aria-label="Video recommendations">
        {video?.snippet?.liveBroadcastContent === "live" && <div className="mb-4 hidden xl:block"><LiveChat /></div>}
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-950 dark:text-white">Related to this video</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Picked based on topic relevance and your activity</p>
          </div>
          {suggestionVideos.length > 0 && <span className="shrink-0 text-xs text-gray-500">{suggestionVideos.length} videos</span>}
        </div>
        {isLoadingSuggestions && (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-1" role="status" aria-label="Loading recommendations">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-2 p-1">
                <div className="aspect-video animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        )}
        {suggestionError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{suggestionError}</p>}
        {!isLoadingSuggestions && !suggestionError && suggestionVideos.length === 0 && (
          <p className="rounded-xl bg-gray-100 p-4 text-sm text-gray-600 dark:bg-[#202020] dark:text-gray-400">No close matches found. Try another video to refresh your recommendations.</p>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-1 xl:gap-1">
          {suggestionVideos.map((item) => (
            <RecommendationCard key={getVideoId(item)} item={item} onDismiss={handleDismissRecommendation} />
          ))}
        </div>
      </aside>
    </main>
  );
};

export default WatchPage;
