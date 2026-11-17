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
    <div className="mx-auto flex w-full max-w-[1800px] flex-col">
      <div className="overflow-hidden rounded-none bg-gray-100 dark:bg-[#202020] md:mx-6 md:mt-4 md:rounded-2xl">
        {banner ? <img src={banner} alt="" className="h-28 w-full object-cover sm:h-36 md:h-48" /> : <div className="h-28 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 dark:from-gray-800 dark:via-[#303030] dark:to-gray-700 sm:h-36 md:h-48" />}
      </div>
      {isLoading && <p className="p-8 text-center text-gray-500" role="status">Loading channel…</p>}
      {error && <p className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}
      {channel && (
        <>
          <div className="flex flex-col items-start gap-4 px-4 py-6 sm:flex-row sm:items-center md:gap-6 md:px-12">
            {channelAvatar ? <img src={channelAvatar} alt={snippet.title} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm dark:border-[#0f0f0f] md:h-28 md:w-28" /> : <FaUserTie className="rounded-full bg-gray-400 p-4 text-6xl text-white md:text-8xl" />}
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{snippet.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {statistics.subscriberCount ? `${formatViewCount(statistics.subscriberCount)} subscribers` : "Subscriber count hidden"}
                {statistics.videoCount ? ` • ${formatViewCount(statistics.videoCount)} videos` : ""}
              </p>
              {snippet.description && <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{snippet.description}</p>}
              <a className="mt-2 w-fit rounded-full bg-black px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-black" href={`https://www.youtube.com/channel/${channelId}`} target="_blank" rel="noreferrer">Open on YouTube</a>
            </div>
          </div>
          <div className="sticky top-0 z-10 flex gap-7 overflow-x-auto border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-gray-800 dark:bg-[#0f0f0f]/95 md:px-12" role="tablist" aria-label="Channel sections">
            {tabs.map((tab) => <button key={tab} className={`whitespace-nowrap border-b-2 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? "border-red-600 text-black dark:text-white" : "border-transparent text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"}`} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>
          <div className="px-3 py-6 sm:px-4 md:px-8 md:py-8">
            {activeTab === "About" ? (
              <div className="max-w-3xl whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{snippet.description || "No channel description provided."}</div>
             ) : (
              <>
                {activeTab === "Home" && <h2 className="mb-4 text-lg font-bold">Latest videos</h2>}
                <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(activeTab === "Home" ? videos.slice(0, 8) : videos).map((video) => {
                  const videoId = video.id?.videoId || video.id;
                  return <Link key={videoId} to={"/watch?v=" + encodeURIComponent(videoId)}><VideoCard info={video} /></Link>;
                })}
              </div>
              </>
            )}
            {!videos.length && activeTab !== "About" && <p className="py-8 text-center text-gray-500">No public videos found.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelPage;
