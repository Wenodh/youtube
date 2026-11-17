import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import BottomBar from "../BottomBar";

const Body = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <BottomBar />
    </div>
  );
};

export default Body;
