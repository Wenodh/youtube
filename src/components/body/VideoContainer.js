import React, { useEffect, useState } from "react";
import { YOUTUBE_SEARCH_API, YOUTUBE_VIDEOS_API } from "../../utils/constants";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    getVideos();
  }, []);
  const getVideos = async () => {
    try {
      const res = await fetch(YOUTUBE_VIDEOS_API);
      const data = await res.json();
      setVideos(data.items);
    } catch (err) {
    } finally {
    }
  };
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <Link to={"/watch?v=" + video.id}>
          <VideoCard id={video.id} info={video} />
        </Link>
      ))}
    </div>
  );
};

export default VideoContainer;
