import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    getVideos();
  }, [query, categoryId]);

  const getVideos = async () => {
    try {
      let apiUrl = YOUTUBE_VIDEOS_API;
      if (query) {
        apiUrl = YOUTUBE_VIDEOS_SEARCH_API + query;
      }
      if (categoryId) {
        apiUrl += `&videoCategoryId=${categoryId}`;
      }
      if (nextPageToken) {
        apiUrl += `&pageToken=${nextPageToken}`;
      }
      const res = await fetch(apiUrl);
      const data = await res.json();
      setNextPageToken(data.nextPageToken);
      setVideos([...videos, ...data.items]);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos?.map((video) => (
          <Link
            key={video.id?.videoId || video.id}
            to={"/watch?v=" + `${video?.id?.videoId || video.id}`}
          >
            <VideoCard id={video.id?.videoId || video.id} info={video} />
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="mx-auto my-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={getVideos}
        >
          Load more
        </button>
      </div>
    </>
  );
};

export default VideoContainer;
