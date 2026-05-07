import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../../utils/appSlice";
import { useSearchParams } from "react-router-dom";
import { FaUserTie } from "react-icons/fa6";

const ChannelPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const channelName = searchParams.get("c") || "Channel";
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  const tabs = ["Home", "Videos", "Shorts", "Playlists", "Community", "About"];

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="h-32 md:h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 w-full"></div>

      {/* Channel Header */}
      <div className="px-4 md:px-16 py-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="bg-gray-400 p-4 rounded-full">
          <FaUserTie className="text-6xl md:text-8xl text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-4xl font-bold">{channelName}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">@{(channelName).replace(/\s+/g, '').toLowerCase()} • 1.2M subscribers • 150 videos</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">Welcome to the official channel of {channelName}!</p>
          <button className="mt-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-bold text-sm w-fit">
            Subscribe
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-16 border-b border-gray-200 dark:border-gray-800 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-black dark:border-white' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 md:px-16 py-8">
        {activeTab === "Home" && (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-xl font-bold mb-4">Featured Video</h2>
              <div className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="aspect-video w-full md:w-80 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0"></div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg">My most popular video!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1.5M views • 2 months ago</p>
                  <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-300">
                    This is a placeholder for the featured video description. It would normally contain details about what this video is about and why you should watch it.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
        {activeTab !== "Home" && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg italic">{activeTab} content coming soon...</p>
          </div>
        )}
      </div>
      {/* <div className="col-span-full md:col-span-9">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${searchParams.get("v")}`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="col-span-full md:col-span-3">
        {" "}
        recommendations {searchParams?.get("v")}
      </div> */}
    </div>
  );
};

export default ChannelPage;
