import React from "react";
import SideBar from "./SideBar";
import MainContainer from "./MainContainer";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="flex">
      <SideBar />
      <Outlet />
      {/* <MainContainer /> */}
    </div>
  );
};

export default Body;
