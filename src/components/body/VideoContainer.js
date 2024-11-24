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
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const categoryId = searchParams.get("categoryId")

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
      const res = await fetch(apiUrl);
      const data = await res.json();
      setVideos(data.items);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos?.map((video) => (
        <Link key={video.id?.videoId || video.id} to={"/watch?v=" + `${video?.id?.videoId || video.id}`}>
          <VideoCard id={video.id?.videoId || video.id} info={video} />
        </Link>
      ))}
    </div>
  );
};

export default VideoContainer;
