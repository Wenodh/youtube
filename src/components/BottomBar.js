import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsPlayBtn } from "react-icons/bs";
import { MdOutlineSubscriptions, MdOutlineVideoLibrary } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const location = useLocation();

  const navItem = (to, icon, text) => {
    const isActive = to === "/"
      ? location.pathname === "/" && !location.search
      : location.pathname === to || (to === "/library" && ["/history", "/watchlater", "/liked"].includes(location.pathname));

    return (
      <Link
        key={text}
        to={to}
        aria-current={isActive ? "page" : undefined}
        className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 transition-colors focus-visible:outline-offset-2 ${
          isActive ? "text-red-600 dark:text-red-400" : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        {React.createElement(icon, { className: "text-[22px]" })}
        <span className="text-[10px] font-medium">{text}</span>
      </Link>
    );
  };

  if (location.pathname === "/shorts") return null;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 items-center border-t border-gray-200/90 bg-white/95 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-4px_18px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-gray-800 dark:bg-[#0f0f0f]/95 md:hidden"
    >
      {navItem("/", AiOutlineHome, "Home")}
      {navItem("/shorts", BsPlayBtn, "Shorts")}
      {navItem("/underconstruction", MdOutlineSubscriptions, "Subscriptions")}
      {navItem("/library", MdOutlineVideoLibrary, "You")}
    </nav>
  );
};

export default BottomBar;
