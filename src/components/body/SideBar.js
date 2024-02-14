import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [animationParent] = useAutoAnimate();
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  return (
    <div ref={animationParent}>
      {isMenuOpen && (
        <div className="w-48 p-5 shadow-lg ">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>Shorts</li>
            <li>Videos</li>
            <li>Live</li>
          </ul>
          <h1>Subscriptions</h1>
          <ul>
            <li>Music</li>
            <li>Music</li>
            <li>Music</li>
            <li>Music</li>
          </ul>
          <h1>Subscriptions</h1>
          <ul>
            <li>Music</li>
            <li>Music</li>
            <li>Music</li>
            <li>Music</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SideBar;
