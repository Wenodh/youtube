import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  YOUTUBE_VIDEOS_API,
  YOUTUBE_VIDEOS_SEARCH_API,
  YOUTUBE_CHANNELS_API,
} from "../../utils/constants";
import VideoCard from "./VideoCard";

const getVideoId = (video) => video?.id?.videoId || video?.id;

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [channelLogos, setChannelLogos] = useState({});
  const [nextPageToken, setNextPageToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const categoryId = searchParams.get("categoryId") || "";
  const observer = useRef(null);
  const requestController = useRef(null);
  const requestInFlight = useRef(false);

  const getVideos = useCallback(async ({ reset = false } = {}) => {
    if (requestInFlight.current && !reset) return;
    if (reset) {
      requestController.current?.abort();
      requestInFlight.current = false;
    }
    const controller = new AbortController();
    requestController.current = controller;
    requestInFlight.current = true;
    setIsLoading(true);
    setError("");

    try {
      const baseUrl = query
        ? `${YOUTUBE_VIDEOS_SEARCH_API}${encodeURIComponent(query)}`
        : YOUTUBE_VIDEOS_API;
      const url = new URL(baseUrl);
      if (categoryId) url.searchParams.set("videoCategoryId", categoryId);
      if (!reset && nextPageToken) url.searchParams.set("pageToken", nextPageToken);

      const response = await fetch(url.toString(), { signal: controller.signal });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error?.message || "Unable to load videos.");
      if (controller.signal.aborted) return;

      const incoming = Array.isArray(data.items) ? data.items : [];
      setNextPageToken(data.nextPageToken || "");
      setVideos((previous) => {
        const base = reset ? [] : previous;
        const knownIds = new Set(base.map(getVideoId));
        return [...base, ...incoming.filter((video) => {
          const id = getVideoId(video);
          if (!id || knownIds.has(id)) return false;
          knownIds.add(id);
          return true;
        })];
      });
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error("Failed to fetch videos:", requestError);
        setError(requestError.message || "Unable to load videos. Please try again.");
      }
    } finally {
      if (requestController.current === controller) {
        requestInFlight.current = false;
        setIsLoading(false);
      }
    }
  }, [query, categoryId, nextPageToken]);

  useEffect(() => {
    setVideos([]);
    setNextPageToken("");
    setChannelLogos({});
    getVideos({ reset: true });
    return () => {
      requestController.current?.abort();
      requestInFlight.current = false;
    };
    // Start a fresh request only when the search/category changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryId]);

  useEffect(() => {
    const missingIds = [...new Set(videos
      .map((video) => video?.snippet?.channelId)
      .filter((id) => id && !(id in channelLogos)))];
    if (!missingIds.length) return undefined;

    const controller = new AbortController();
    const loadChannelLogos = async () => {
      try {
        for (let index = 0; index < missingIds.length; index += 50) {
          const batch = missingIds.slice(index, index + 50);
          const response = await fetch(YOUTUBE_CHANNELS_API + batch.join(","), { signal: controller.signal });
          const data = await response.json();
          if (!response.ok || data.error) throw new Error(data.error?.message || "Channel lookup failed.");
          const logos = Object.fromEntries(batch.map((id) => [id, null]));
          (data.items || []).forEach((channel) => {
            const url = channel.snippet?.thumbnails?.default?.url;
            if (url) logos[channel.id] = url;
          });
          if (!controller.signal.aborted) setChannelLogos((previous) => ({ ...previous, ...logos }));
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") console.error("Failed to fetch channel details:", requestError);
      }
    };
    loadChannelLogos();
    return () => controller.abort();
  }, [videos, channelLogos]);

  const lastVideoElementRef = useCallback((node) => {
    observer.current?.disconnect();
    if (!node || !nextPageToken || isLoading) return;
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) getVideos();
    }, { rootMargin: "400px" });
    observer.current.observe(node);
  }, [nextPageToken, isLoading, getVideos]);

  useEffect(() => () => observer.current?.disconnect(), []);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-4 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, index) => {
          const videoId = getVideoId(video);
          return (
            <Link key={videoId} to={"/watch?v=" + encodeURIComponent(videoId)} ref={index === videos.length - 1 ? lastVideoElementRef : null}>
              <VideoCard info={video} channelLogo={channelLogos[video?.snippet?.channelId]} />
            </Link>
          );
        })}
      </div>
      {error && (
        <div className="mx-4 my-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">
          {error}
          <button className="ml-2 font-semibold underline" onClick={() => getVideos({ reset: videos.length === 0 })}>Retry</button>
        </div>
      )}
      {isLoading && <div className="flex justify-center p-4" role="status" aria-label="Loading videos"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div></div>}
      {!isLoading && !error && videos.length === 0 && <p className="p-8 text-center text-gray-500">No videos found.</p>}
    </>
  );
};

export default VideoContainer;
