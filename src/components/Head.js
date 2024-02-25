import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
const Head = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => getSearchSuggestions(), 200);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);
  const getSearchSuggestions = async () => {
    const url =
      "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=" +
      searchQuery +
      "&key=" +
      process.env.REACT_APP_GOOGLE_API_KEY;
    // --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
    // --header 'Accept: application/json' \
    // --compressed
    try {
      const data = await fetch(YOUTUBE_SEARCH_API + searchQuery);
      // const data = await fetch(url);
      const json = await data.json();
      console.log(json);
    } catch (err) {
      console.log(err);
    }
  };
  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };
  return (
    <div className="m-2 grid grid-flow-col items-center p-4 shadow-xl">
      <div className="col-span-1 flex items-center gap-2 ">
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
      <div className="col-span-10 text-start relative">
        <div className="flex w-2/3">
          <input
            className="w-full relative rounded-l-full border border-gray-400 p-2 pl-6"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          ></input>
          <button className="rounded-r-full border border-gray-400 p-2 pl-4">
            🔍
          </button>
        </div>
       { showSuggestions && <div className="absolute bg-white rounded-lg shadow-2xl w-2/3 float-end border border-gray-100">
          <ul>
            <li className="px-2 py-1 border-b shadow-sm hover:bg-gray-100">🔍 {searchQuery}</li>
            <li className="px-2 py-1 border-b shadow-sm hover:bg-gray-100">🔍 Iphone</li>
          </ul>
        </div>}
      </div>
      <div className="">
        <FaUser />
      </div>
    </div>
  );
};

export default Head;
