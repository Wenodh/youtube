import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeMenu } from "../../../utils/appSlice";
import { Link, useSearchParams } from "react-router-dom";
import CommentsContainer from "./CommentsContainer";
import { YOUTUBE_VIDEOS_API, YOUTUBE_VIDEO_BY_ID } from "../../../utils/constants";
import { formatDate, formatViewCount } from "../../../utils/helperFunctions";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import { GoDownload } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const videoDetails = YOUTUBE_VIDEO_BY_ID + searchParams.get("v");
  const [videoInfo, setVideoInfo] = useState([]);

  useEffect(() => {
    const getVideoInfo = async () => {
      const data = await fetch(videoDetails);
      const json = await data.json();
      setVideoInfo(json.items);
    };
    getVideoInfo();
  }, [videoDetails]);
  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  const [suggestionVideo, setSuggestionVideo] = useState([]);

  useEffect(() => {
    const getSubscriber = async () => {
      const data = await fetch(YOUTUBE_VIDEOS_API);
      const json = await data.json();
      setSuggestionVideo(json.items);
    };
    getSubscriber();
  }, []);

  return (
    <div className="grid w-full grid-cols-12 p-2 md:p-4 pb-20 md:pb-4">
      <div className="col-span-full xl:col-span-9">
        <iframe
          className="aspect-video w-full rounded-xl"
          src={`https://www.youtube.com/embed/${searchParams.get("v")}`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        {videoInfo.map((video) => {
          return (
            <>
              {/* Subscriber Section */}
              <div key={video.id} className="col-span-full">
                <h1 className="m-2 overflow-hidden text-ellipsis text-xl font-bold">
                  {video?.snippet?.title}
                </h1>
                <div className="flex flex-col m-2 w-full gap-4 md:flex-row md:items-center">
                    <div className="flex items-center">
                      <FaUserTie className="rounded-full border border-gray-400 text-4xl" />
                      <ul>
                        <li className="ml-2 font-bold text-gray-800 line-clamp-1">
                          {video?.snippet?.channelTitle}
                        </li>
                        <li className=" ml-2 text-xs text-gray-500">777M Subscribers</li>
                      </ul>
                      <button className="ml-4 rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                        Subscribe
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                      <div className="flex shrink-0 rounded-full bg-gray-100">
                        <button className="flex items-center gap-2 border-r border-gray-300 px-3 py-2 hover:bg-gray-200">
                          <FiThumbsUp /> {formatViewCount(video?.statistics?.likeCount)}
                        </button>
                        <button className="px-3 py-2 hover:bg-gray-200">
                          <FiThumbsDown />
                        </button>
                      </div>
                      <button className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200">
                        <PiShareFat className="text-xl" /> Share
                      </button>
                      <button className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200">
                        <GoDownload className="text-xl" /> Download
                      </button>
                      <button className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 p-2 hover:bg-gray-200">
                        <BsThreeDots />
                      </button>
                    </div>
                </div>
              </div>
              {/* Video Details Section */}
              <div className="m-2 rounded-lg bg-gray-100 p-2 shadow-sm">
                <p className="font-bold">
                  {formatViewCount(video?.statistics?.viewCount)} Views 😎{" "}
                  {formatDate(video?.snippet?.publishedAt)}
                </p>
                <p>{video?.snippet?.description}</p>
              </div>
              {/* Comment Section */}
              <div className="mt-5">
                <h1 className="m-2  text-2xl font-bold">
                  {formatViewCount(video?.statistics?.commentCount)} Comments.
                </h1>
              </div>
              <CommentsContainer />
            </>
          );
        })}
      </div>
      <div className="col-span-full p-2 xl:col-span-3">
        <h2 className="mb-2 font-bold">Recommendations</h2>
        <div className="flex flex-col gap-2">
          {suggestionVideo.map((info) => {
            return (
              <Link to={"?v=" + info.id} key={info.id}>
                <div className="flex gap-2 rounded-md hover:bg-gray-100 p-1">
                  <img
                    className="h-24 w-40 rounded-lg object-cover"
                    src={info?.snippet?.thumbnails?.medium?.url}
                    alt="thumbnails"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight">
                      {info?.snippet?.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600">
                      {info?.snippet?.channelTitle}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatViewCount(info?.statistics?.viewCount)} views
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
