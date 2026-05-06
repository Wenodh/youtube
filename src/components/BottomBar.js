import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsPlayBtn } from "react-icons/bs";
import { MdOutlineSubscriptions, MdOutlineVideoLibrary } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const location = useLocation();

  const navItem = (to, icon, text) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center justify-center gap-1 ${
          isActive ? "text-black" : "text-gray-600"
        }`}
      >
        {React.createElement(icon, { className: "text-2xl" })}
        <span className="text-[10px]">{text}</span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white py-2 md:hidden">
      {navItem("/", AiOutlineHome, "Home")}
      {navItem("/shorts", BsPlayBtn, "Shorts")}
      {navItem("/underconstruction", MdOutlineSubscriptions, "Subscriptions")}
      {navItem("/underconstruction", MdOutlineVideoLibrary, "You")}
    </div>
  );
};

export default BottomBar;
