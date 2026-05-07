import React from "react";
import SideBar from "./SideBar";
import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "../BottomBar";
import MiniPlayer from "./MiniPlayer";

const Body = () => {
  const location = useLocation();
  const isWatchPage = location.pathname === "/watch";
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      {!isWatchPage && <MiniPlayer />}
      <BottomBar />
    </div>
  );
};

export default Body;
