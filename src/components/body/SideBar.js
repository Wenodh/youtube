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
import { FaShopify, FaUser, FaCircleUser } from "react-icons/fa6";
import { PiStudentFill } from "react-icons/pi";
import { FcStart, FcFeedback, FcManager, FcPortraitMode } from "react-icons/fc";
import { ImYoutube2 } from "react-icons/im";
import { SiYoutubemusic } from "react-icons/si";
import { VscReport } from "react-icons/vsc";
import { CiYoutube } from "react-icons/ci";
const SideBar = () => {
  const [animationParent] = useAutoAnimate();
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  const menuItem = (to, icon, text) => (
    <li className="flex rounded-lg py-2 pl-2 hover:bg-gray-200">
      <Link to={to} className="flex">
        {React.createElement(icon, { className: "mr-5 mt-1 text-xl" })}
        {text}
      </Link>
    </li>
  );

  return (
    <div ref={animationParent} className={isMenuOpen ? "w-64" : ""}>
      {isMenuOpen && (
        <div className="w-48 p-5 shadow-lg min-h-screen h-full overflow-y-auto absolute">
          <ul>
            {menuItem("/", AiOutlineHome, "Home")}
            {menuItem("/underconstruction", BsPlayBtn, "Shorts")}
            {menuItem("/underconstruction", MdOutlineSubscriptions, "Subscriptions")}
          </ul>
          <hr className="mt-2" />
          <ul>
            {menuItem("/underconstruction", MdOutlineVideoLibrary, "Library")}
            {menuItem("/underconstruction", GrHistory, "History")}
            {menuItem("/underconstruction", GoVideo, "Your Videos")}
            {menuItem("/underconstruction", MdOutlineWatchLater, "Watch Later")}
            {menuItem("/underconstruction", AiOutlineLike, "Liked Videos")}
          </ul>
          <hr className="mt-2" />
          <h3 className="mt-5 font-bold">Explore</h3>
          <ul>
            {menuItem("/underconstruction", HiTrendingUp, "Trending")}
            {menuItem("/underconstruction", IoGameControllerOutline, "Gaming")}
            {menuItem("/underconstruction", BiMoviePlay, "Movies")}
            {menuItem("/underconstruction", IoMusicalNotesOutline, "Music")}
            {menuItem("/underconstruction", MdOutlineLiveTv, "Live")}
            {menuItem("/underconstruction", IoNewspaperOutline, "News")}
            {menuItem("/underconstruction", AiOutlineShopping, "Shopping")}
            {menuItem("/underconstruction", MdOutlineSportsSoccer, "Sports")}
            {menuItem("/underconstruction", PiStudentFill, "Learning")}
            {menuItem("/underconstruction", FaShopify, "Fasion & Beauty")}
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
