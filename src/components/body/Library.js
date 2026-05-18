import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import { useDownloads } from "../../hooks/useDownloads";
import { clearHistory } from "../../utils/appSlice";

const Library = ({ type }) => {
  const dispatch = useDispatch();
  const history = useSelector((store) => store.app.history);
  const watchLater = useSelector((store) => store.app.watchLater);
  const likedVideos = useSelector((store) => store.app.likedVideos);
  const { downloads } = useDownloads();

  let displayVideos = [];
  let title = "";

  if (type === "history") {
    displayVideos = history;
    title = "History";
  } else if (type === "watchlater") {
    displayVideos = watchLater;
    title = "Watch Later";
  } else if (type === "liked") {
    displayVideos = likedVideos;
    title = "Liked Videos";
  } else {
    // Library summary
    return (
      <div className="p-4 md:p-8 w-full">
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">History</h2>
            <Link to="/history" className="text-blue-500 text-sm font-bold">See all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {history.slice(0, 5).map(v => (
              <Link key={v.id?.videoId || v.id} to={"/watch?v=" + (v.id?.videoId || v.id)}>
                <VideoCard info={v} />
              </Link>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">Watch Later</h2>
            <Link to="/watchlater" className="text-blue-500 text-sm font-bold">See all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watchLater.slice(0, 5).map(v => (
              <Link key={v.id?.videoId || v.id} to={"/watch?v=" + (v.id?.videoId || v.id)}>
                <VideoCard info={v} />
              </Link>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">Liked Videos</h2>
            <Link to="/liked" className="text-blue-500 text-sm font-bold">See all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {likedVideos.slice(0, 5).map(v => (
              <Link key={v.id?.videoId || v.id} to={"/watch?v=" + (v.id?.videoId || v.id)}>
                <VideoCard info={v} />
              </Link>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">Downloads</h2>
            <Link to="/downloads" className="text-blue-500 text-sm font-bold">See all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {downloads.slice(0, 5).map(v => (
              <Link key={v.id?.videoId || v.id} to={"/watch?v=" + (v.id?.videoId || v.id)}>
                <VideoCard info={v.fullData} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {type === "history" && history.length > 0 && (
          <button
            onClick={() => dispatch(clearHistory())}
            className="text-red-500 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-full"
          >
            Clear all watch history
          </button>
        )}
      </div>
      {displayVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No videos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayVideos.map((v) => (
            <Link key={v.id?.videoId || v.id} to={"/watch?v=" + (v.id?.videoId || v.id)}>
              <VideoCard info={v} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
