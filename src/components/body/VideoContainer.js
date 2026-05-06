import React, { useEffect, useState, useCallback } from "react";
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

  useEffect(() => {
    setVideos([]);
    setNextPageToken("");
    getVideos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryId]); // Removed getVideos from here as it would cause infinite loop because it depends on nextPageToken

  return (
    <>
      <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-4 lg:grid-cols-3 xl:grid-cols-4">
        {videos?.map((video) => (
          <Link
            key={video.id?.videoId || video.id}
            to={"/watch?v=" + (video?.id?.videoId || video.id)}
          >
            <VideoCard id={video.id?.videoId || video.id} info={video} />
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="mx-auto my-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => getVideos(false)}
        >
          Load more
        </button>
      </div>
    </>
  );
};

export default VideoContainer;
