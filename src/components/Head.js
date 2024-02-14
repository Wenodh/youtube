import React from "react";
import { CiMenuBurger } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
const Head = () => {
  const dispatch = useDispatch();
  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };
  return (
    <div className="m-2 grid grid-flow-col items-center p-4 shadow-xl">
      <div className="col-span-1 flex items-center gap-2">
        <CiMenuBurger
          onClick={toggleMenuHandler}
          className="cursor-pointer text-xl"
        />
        <img
          className="mx-2 h-6"
          alt="youtube-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/2560px-YouTube_Logo_2017.svg.png"
        />
      </div>
      {/* <FaYoutube /> */}
      <div className="col-span-10 text-center">
        <input
          className="w-1/2 rounded-l-full border border-gray-400 p-2 pl-6"
          type="text"
          placeholder="Search"
        />
        <button className="rounded-r-full border border-gray-400 p-2 pl-4">
          🔍
          {/* <CiSearch /> */}
        </button>
      </div>
      <div className="">
        <FaUser />
      </div>
    </div>
  );
};

export default Head;
