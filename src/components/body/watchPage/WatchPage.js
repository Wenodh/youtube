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
  }, []);
  useEffect(() => {
    dispatch(closeMenu());
  }, []);

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
    <div className="grid w-full grid-cols-12 p-4">
      <div className="col-span-full md:col-span-9">
        <iframe
          className="aspect-video w-full"
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
                <div className="flex m-2 w-full">
                    <FaUserTie className="mt-1 rounded-full border border-gray-400 text-4xl" />
                    <ul>
                      <li className="ml-2 font-bold text-gray-800">
                        {video?.snippet?.channelTitle}
                      </li>
                      <li className=" ml-2 text-sm">777M Subscribers</li>
                    </ul>
                    <div className="flex justify-between">
                      <button className="m-2 ml-5 rounded-full border border-gray-200 bg-black px-5 py-1 text-white shadow-sm">
                        Subscribe
                    </button>
                    <div className="flex justify-between">
                      <button className="m-2 ml-32 flex rounded-full border border-gray-200 bg-gray-200 px-2 py-1 shadow-sm hover:bg-gray-300">
                        <FiThumbsUp className="mx-3 mt-1" />{" "}
                        {formatViewCount(video?.statistics?.likeCount)} |{" "}
                        <FiThumbsDown className="mx-3 mt-1" />
                      </button>
                      <button className=" m-2 flex rounded-full border border-gray-200 bg-gray-200 px-2 py-1 shadow-sm hover:bg-gray-300 ">
                        <PiShareFat className="mx-2 mt-1 text-xl" /> Share
                      </button>
                      <button className="m-2 flex rounded-full border border-gray-200 bg-gray-200 px-2 py-1 shadow-sm hover:bg-gray-300 ">
                        <GoDownload className="mx-1 text-xl" /> Download
                      </button>
                      <button className="m-2 rounded-full border border-gray-200 bg-gray-200 px-2 py-1 shadow-sm hover:bg-gray-300 ">
                        <BsThreeDots />
                      </button>
                      </div>
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
      <div className="col-span-full p-2 md:col-span-3">
        Recommendations
        {suggestionVideo.map((info) => {
          return (
            <>
              <Link to={"?v=" + info.id} key={info.id}>
                <div className="flex w-[28rem] rounded-md p-2 hover:bg-gray-200">
                  <img
                    className="rounded-xl"
                    src={info?.snippet?.thumbnails?.default?.url}
                    alt="thumails"
                  />
                  <ul className="ml-2 overflow-hidden text-ellipsis">
                    <li className="text-gray w-[28rem] text-sm font-bold">
                      {info?.snippet?.title}
                    </li>
                    <li className="text-sm">{info?.snippet?.channelTitle}</li>
                    <li className="text-sm">
                      {formatViewCount(info?.statistics?.viewCount)} Views
                    </li>
                  </ul>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default WatchPage;
