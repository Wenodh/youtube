import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../../utils/appSlice";
import { Link, useSearchParams } from "react-router-dom";
import { FaUserTie } from "react-icons/fa6";
import { YOUTUBE_CHANNEL_BY_ID, YOUTUBE_CHANNEL_VIDEOS_API } from "../../../utils/constants";
import { formatViewCount } from "../../../utils/helperFunctions";
import VideoCard from "../VideoCard";
import { fetchYouTubeJson } from "../../../utils/youtubeApi";

const ChannelPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("id") || "";
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { dispatch(closeMenu()); }, [dispatch]);

  useEffect(() => {
    if (!channelId) {
      setIsLoading(false);
      setError("Channel details require a valid channel ID. Open a channel from a video page.");
      return undefined;
    }
    const controller = new AbortController();
    const loadChannel = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [channelData, videosData] = await Promise.all([
          fetchYouTubeJson(YOUTUBE_CHANNEL_BY_ID + encodeURIComponent(channelId), { signal: controller.signal, ttlMs: 900_000 }),
          fetchYouTubeJson(YOUTUBE_CHANNEL_VIDEOS_API + encodeURIComponent(channelId), { signal: controller.signal, ttlMs: 300_000 }),
        ]);
        if (!controller.signal.aborted) {
          setChannel(channelData.items?.[0] || null);
          setVideos(videosData.items || []);
          if (!channelData.items?.[0]) setError("This channel could not be found.");
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message || "Unable to load channel.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    loadChannel();
    return () => controller.abort();
  }, [channelId]);

  const snippet = channel?.snippet || {};
  const statistics = channel?.statistics || {};
  const tabs = ["Home", "Videos", "About"];
  const channelAvatar = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url;
  const banner = channel?.brandingSettings?.image?.bannerExternalUrl;

  return (
    <div className="flex w-full flex-col">
      {banner ? <img src={banner} alt="" className="h-32 w-full object-cover md:h-48" /> : <div className="h-32 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 md:h-48" />}
      {isLoading && <p className="p-8 text-center text-gray-500" role="status">Loading channel…</p>}
      {error && <p className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}
      {channel && (
        <>
          <div className="flex flex-col items-start gap-4 px-4 py-6 md:flex-row md:items-center md:px-16">
            {channelAvatar ? <img src={channelAvatar} alt={snippet.title} className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32" /> : <FaUserTie className="rounded-full bg-gray-400 p-4 text-6xl text-white md:text-8xl" />}
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-2xl font-bold md:text-4xl">{snippet.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {statistics.subscriberCount ? `${formatViewCount(statistics.subscriberCount)} subscribers` : "Subscriber count hidden"}
                {statistics.videoCount ? ` • ${formatViewCount(statistics.videoCount)} videos` : ""}
              </p>
              {snippet.description && <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{snippet.description}</p>}
              <a className="mt-2 w-fit rounded-full bg-black px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-black" href={`https://www.youtube.com/channel/${channelId}`} target="_blank" rel="noreferrer">Open on YouTube</a>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto border-b border-gray-200 px-4 dark:border-gray-800 md:px-16">
            {tabs.map((tab) => <button key={tab} className={`whitespace-nowrap pb-3 text-sm font-bold ${activeTab === tab ? "border-b-2 border-black dark:border-white" : "text-gray-600 dark:text-gray-400"}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>
          <div className="px-4 py-8 md:px-8">
            {activeTab === "About" ? (
              <div className="max-w-3xl whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{snippet.description || "No channel description provided."}</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {videos.map((video) => {
                  const videoId = video.id?.videoId || video.id;
                  return <Link key={videoId} to={"/watch?v=" + encodeURIComponent(videoId)}><VideoCard info={video} /></Link>;
                })}
              </div>
            )}
            {!videos.length && activeTab !== "About" && <p className="py-8 text-center text-gray-500">No public videos found.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelPage;
