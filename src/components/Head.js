import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import { cacheResults } from "../utils/searchSlice";
import { Link, useNavigate } from "react-router-dom";

const Head = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchCache = useSelector((store) => store.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCache[searchQuery]) {
        setSuggestions(searchCache[searchQuery]);
      } else {
        getSearchSuggestions();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, searchCache]);

  const getSearchSuggestions = async () => {
    try {
      const res = await axios({
        url: YOUTUBE_SEARCH_API,
        adapter: jsonpAdapter,
        params: {
          client: "youtube",
          hl: "en",
          ds: "yt",
          q: searchQuery,
        },
      });

      const data = res.data[1].map((it) => it[0]);
      dispatch(cacheResults({ [searchQuery]: data }));
      setSuggestions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  const handleBlur = (e) => {
    // Check if the blur event is related to the suggestion list
    // if (!e.currentTarget.contains(e.relatedTarget)) {
    //   setShowSuggestions(false);
    // }
  };

  return (
    <div className="m-2 grid grid-flow-col items-center p-4 shadow-xl">
      <div className="col-span-1 flex items-center gap-2 ">
        <CiMenuBurger
          onClick={toggleMenuHandler}
          className="cursor-pointer text-xl"
        />
        <img
          className="mx-2 h-6 cursor-pointer"
          alt="youtube-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/2560px-YouTube_Logo_2017.svg.png"
          onClick={() => navigate(`/`)}
        />
      </div>
      <div className="relative col-span-10 flex justify-center">
        <div className="flex w-2/3">
          <input
            className="relative w-full rounded-l-full border border-gray-400 p-2 pl-6"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
          />
          <button
            className="rounded-r-full border border-gray-400 p-2 pl-4"
            onClick={(e) => {
              if (!searchQuery) return;
              navigate(`/?q=${searchQuery}`);
              setShowSuggestions(false);
            }}
          >
            🔍
          </button>
        </div>
        {showSuggestions && (
          <div className="absolute top-11 z-10 max-h-60 w-2/3 overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-2xl">
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="block border-b px-2 py-1 shadow-sm hover:bg-gray-100"
                  onClick={() => {
                    console.log("called", suggestion);
                    navigate(`/?q=${suggestion}`);
                    setShowSuggestions(false);
                  }}
                >
                  🔍 {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="">
        <FaUser />
      </div>
    </div>
  );
};

export default Head;
