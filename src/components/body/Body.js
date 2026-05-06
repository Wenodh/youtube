import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import BottomBar from "../BottomBar";

const Body = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex">
        <SideBar />
        <Outlet />
      </div>
      <BottomBar />
    </div>
  );
};

export default Body;
