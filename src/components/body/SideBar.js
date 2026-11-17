import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const menuItem = (to, icon, text) => {
    const isActive = to === "/"
      ? location.pathname === "/" && !location.search
      : to.startsWith("/?")
        ? location.pathname === "/" && location.search === to.slice(1)
        : location.pathname === to;

    return (
      <li key={text}>
        <Link
          to={to}
          aria-current={isActive ? "page" : undefined}
          className={`flex min-h-10 w-full items-center rounded-lg px-3 py-2 transition-colors focus-visible:outline-offset-2 ${
            isActive
              ? "bg-gray-100 font-semibold text-black dark:bg-gray-800 dark:text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {React.createElement(icon, { className: "mr-5 shrink-0 text-xl" })}
          <span className="text-sm">{text}</span>
        </Link>
      </li>
    );
  };

  if (!isMenuOpen) return <div ref={animationParent} />;

  return (
    <div ref={animationParent} className="md:w-64">
      <aside className="absolute z-20 h-full min-h-screen w-56 overflow-y-auto bg-white p-3 shadow-lg dark:bg-[#0f0f0f] md:static md:w-64 md:shadow-none">
        <ul className="space-y-1">
          {menuItem("/", AiOutlineHome, "Home")}
          {menuItem("/shorts", BsPlayBtn, "Shorts")}
          {menuItem("/underconstruction", MdOutlineSubscriptions, "Subscriptions")}
        </ul>
        <hr className="my-3 border-gray-200 dark:border-gray-800" />
        <ul className="space-y-1">
          {menuItem("/library", MdOutlineVideoLibrary, "Library")}
          {menuItem("/history", GrHistory, "History")}
          {menuItem("/underconstruction", GoVideo, "Your Videos")}
          {menuItem("/watchlater", MdOutlineWatchLater, "Watch Later")}
          {menuItem("/liked", AiOutlineLike, "Liked Videos")}
        </ul>
        <hr className="my-3 border-gray-200 dark:border-gray-800" />
        <h3 className="mb-2 ml-3 text-xs font-bold uppercase tracking-wider text-gray-500">Explore</h3>
        <ul className="space-y-1">
          {menuItem("/", HiTrendingUp, "Trending")}
          {menuItem("/?categoryId=20", IoGameControllerOutline, "Gaming")}
          {menuItem("/?categoryId=30", BiMoviePlay, "Movies")}
          {menuItem("/?categoryId=10", IoMusicalNotesOutline, "Music")}
          {menuItem("/underconstruction", MdOutlineLiveTv, "Live")}
          {menuItem("/?categoryId=25", IoNewspaperOutline, "News")}
          {menuItem("/underconstruction", AiOutlineShopping, "Shopping")}
          {menuItem("/?categoryId=17", MdOutlineSportsSoccer, "Sports")}
          {menuItem("/?categoryId=27", PiStudentFill, "Learning")}
          {menuItem("/?categoryId=26", FaShopify, "Fashion & Beauty")}
        </ul>
        <hr className="my-3 border-gray-200 dark:border-gray-800" />
        <h3 className="mb-2 ml-3 text-xs font-bold uppercase tracking-wider text-gray-500">More from YouTube</h3>
        <ul className="space-y-1">
          {menuItem("/underconstruction", ImYoutube2, "YouTube Premium")}
          {menuItem("/underconstruction", SiYoutubemusic, "YouTube Studio")}
          {menuItem("/underconstruction", CiYoutube, "YouTube Music")}
          {menuItem("/underconstruction", FcStart, "YouTube Kids")}
        </ul>
        <hr className="my-3 border-gray-200 dark:border-gray-800" />
        <ul className="space-y-1">
          {menuItem("/underconstruction", AiOutlineSetting, "Settings")}
          {menuItem("/underconstruction", VscReport, "Report History")}
          {menuItem("/underconstruction", BiHelpCircle, "Help")}
          {menuItem("/underconstruction", FcFeedback, "Send Feedback")}
        </ul>
      </aside>
    </div>
  );
};

export default SideBar;
