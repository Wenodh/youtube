import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  YOUTUBE_VIDEOS_API,
  YOUTUBE_VIDEOS_SEARCH_API,
} from "../../utils/constants";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");

  const getVideos = useCallback(
    async (isNewQuery = false) => {
      try {
        let apiUrl = YOUTUBE_VIDEOS_API;
        if (query) {
          apiUrl = YOUTUBE_VIDEOS_SEARCH_API + query;
        }
        if (categoryId) {
          apiUrl += `&videoCategoryId=${categoryId}`;
        }
        if (!isNewQuery && nextPageToken) {
          apiUrl += `&pageToken=${nextPageToken}`;
        }
        const res = await fetch(apiUrl);
        const data = await res.json();
        setNextPageToken(data.nextPageToken);
        if (isNewQuery) {
          setVideos(data.items);
        } else {
          setVideos((prev) => [...prev, ...data.items]);
        }
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    },
    [query, categoryId, nextPageToken],
  );

  const observer = useRef();
  const lastVideoElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          getVideos(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [nextPageToken, getVideos],
  );

  useEffect(() => {
    setVideos([]);
    setNextPageToken("");
    getVideos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryId]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-4 lg:grid-cols-3 xl:grid-cols-4">
        {videos?.map((video, index) => {
          const videoId = video.id?.videoId || video.id;
          const isLastElement = videos.length === index + 1;

          return (
            <Link
              key={videoId}
              to={"/watch?v=" + videoId}
              ref={isLastElement ? lastVideoElementRef : null}
            >
              <VideoCard id={videoId} info={video} />
            </Link>
          );
        })}
      </div>
      {nextPageToken && (
        <div className="flex justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </>
  );
};

export default VideoContainer;
