import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineLike,
  AiOutlineShopping,
  AiOutlineSetting,
} from "react-icons/ai";
import {
  MdOutlineSubscriptions,
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdOutlineLiveTv,
  MdOutlineSportsSoccer,
} from "react-icons/md";
import { GrHistory } from "react-icons/gr";
import { BsPlayBtn } from "react-icons/bs";
import { GoVideo } from "react-icons/go";
import { HiTrendingUp } from "react-icons/hi";
import {
  IoGameControllerOutline,
  IoMusicalNotesOutline,
  IoNewspaperOutline,
} from "react-icons/io5";
import { BiMoviePlay, BiHelpCircle } from "react-icons/bi";
import { FaShopify } from "react-icons/fa6";
import { PiStudentFill } from "react-icons/pi";
import { FcStart, FcFeedback } from "react-icons/fc";
import { ImYoutube2 } from "react-icons/im";
import { SiYoutubemusic } from "react-icons/si";
import { VscReport } from "react-icons/vsc";
import { CiYoutube } from "react-icons/ci";
const SideBar = () => {
  const [animationParent] = useAutoAnimate();
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  const menuItem = (to, icon, text) => (
    <li className="flex rounded-lg py-2 pl-2 hover:bg-gray-200 dark:hover:bg-gray-800">
      <Link to={to} className="flex w-full items-center">
        {React.createElement(icon, { className: "mr-5 text-xl" })}
        <span className="text-sm">{text}</span>
      </Link>
    </li>
  );

  return (
    <div ref={animationParent} className={isMenuOpen ? "md:w-64" : ""}>
      {isMenuOpen && (
        <div className="absolute z-20 h-full min-h-screen w-56 overflow-y-auto bg-white dark:bg-[#0f0f0f] p-3 shadow-lg md:static">
          <ul>
            {menuItem("/", AiOutlineHome, "Home")}
            {menuItem("/shorts", BsPlayBtn, "Shorts")}
            {menuItem("/underconstruction", MdOutlineSubscriptions, "Subscriptions")}
          </ul>
          <hr className="my-3 border-gray-200 dark:border-gray-800" />
          <ul>
            {menuItem("/library", MdOutlineVideoLibrary, "Library")}
            {menuItem("/history", GrHistory, "History")}
            {menuItem("/underconstruction", GoVideo, "Your Videos")}
            {menuItem("/watchlater", MdOutlineWatchLater, "Watch Later")}
            {menuItem("/liked", AiOutlineLike, "Liked Videos")}
          </ul>
          <hr className="my-3 border-gray-200 dark:border-gray-800" />
          <h3 className="mb-2 ml-2 text-sm font-bold">Explore</h3>
          <ul>
            {menuItem("/?categoryId=17", HiTrendingUp, "Trending")}
            {menuItem("/?categoryId=20", IoGameControllerOutline, "Gaming")}
            {menuItem("/?categoryId=30", BiMoviePlay, "Movies")}
            {menuItem("/?categoryId=10", IoMusicalNotesOutline, "Music")}
            {menuItem("/?categoryId=1", MdOutlineLiveTv, "Live")}
            {menuItem("/?categoryId=25", IoNewspaperOutline, "News")}
            {menuItem("/?categoryId=1", AiOutlineShopping, "Shopping")}
            {menuItem("/?categoryId=17", MdOutlineSportsSoccer, "Sports")}
            {menuItem("/?categoryId=27", PiStudentFill, "Learning")}
            {menuItem("/?categoryId=26", FaShopify, "Fashion & Beauty")}
          </ul>
          <hr className="mt-2" />
          <h3 className="mt-5 font-bold">More from YouTube</h3>
          <ul>
            {menuItem("/underconstruction", ImYoutube2, "Youtube Premium")}
            {menuItem("/underconstruction", SiYoutubemusic, "Youtube Studio")}
            {menuItem("/underconstruction", CiYoutube, "Youtube Music")}
            {menuItem("/underconstruction", FcStart, "Youtube Kids")}
          </ul>
          <hr className="mt-2" />
          <ul>
            {menuItem("/underconstruction", AiOutlineSetting, "Setting")}
            {menuItem("/underconstruction", VscReport, "Report History")}
            {menuItem("/underconstruction", BiHelpCircle, "Help")}
            {menuItem("/underconstruction", FcFeedback, "Send Feedback")}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SideBar;
