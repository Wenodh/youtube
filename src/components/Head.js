import React, { useEffect, useState, useCallback } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { IoSearchOutline, IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import { cacheResults } from "../utils/searchSlice";
import { useNavigate } from "react-router-dom";

const Head = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const searchCache = useSelector((store) => store.search);

  const getSearchSuggestions = useCallback(async () => {
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
  }, [searchQuery, dispatch]);

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
  }, [searchQuery, searchCache, getSearchSuggestions]);

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  const handleBlur = (e) => {
    // Check if the blur event is related to the suggestion list
    // if (!e.currentTarget.contains(e.relatedTarget)) {
    //   setShowSuggestions(false);
    // }
  };

  if (isMobileSearchVisible) {
    return (
      <div className="flex items-center gap-2 p-4 shadow-xl md:hidden">
        <IoArrowBackOutline
          className="cursor-pointer text-2xl"
          onClick={() => setIsMobileSearchVisible(false)}
        />
        <div className="relative flex flex-grow">
          <input
            className="w-full rounded-full border border-gray-400 p-2 px-4 outline-none"
            type="text"
            placeholder="Search"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?q=${searchQuery}`);
                setShowSuggestions(false);
                setIsMobileSearchVisible(false);
              }
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-12 z-10 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-2xl">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="block border-b px-4 py-2 shadow-sm hover:bg-gray-100"
                    onMouseDown={(e) => {
                      // Using onMouseDown to trigger before onBlur
                      e.preventDefault();
                      setSearchQuery(suggestion);
                      navigate(`/?q=${suggestion}`);
                      setShowSuggestions(false);
                      setIsMobileSearchVisible(false);
                    }}
                  >
                    🔍 {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 shadow-sm md:shadow-xl">
      <div className="flex items-center gap-2">
        <CiMenuBurger
          onClick={toggleMenuHandler}
          className="hidden cursor-pointer text-xl md:block"
        />
        <img
          className="h-5 cursor-pointer md:mx-2 md:h-6"
          alt="youtube-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/2560px-YouTube_Logo_2017.svg.png"
          onClick={() => navigate(`/`)}
        />
      </div>

      <div className="relative hidden w-1/2 md:flex md:justify-center">
        <div className="flex w-full max-w-2xl">
          <input
            className="relative w-full rounded-l-full border border-gray-400 p-2 pl-6 outline-none"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?q=${searchQuery}`);
                setShowSuggestions(false);
              }
            }}
          />
          <button
            className="rounded-r-full border border-gray-400 bg-gray-100 p-2 px-5 hover:bg-gray-200"
            onClick={() => {
              if (!searchQuery) return;
              navigate(`/?q=${searchQuery}`);
              setShowSuggestions(false);
            }}
          >
            🔍
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-11 z-10 max-h-60 w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-2xl">
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="block border-b px-4 py-2 shadow-sm hover:bg-gray-100"
                  onClick={() => {
                    setSearchQuery(suggestion);
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

      <div className="flex items-center gap-4">
        <IoSearchOutline
          className="cursor-pointer text-2xl md:hidden"
          onClick={() => setIsMobileSearchVisible(true)}
        />
        <FaUser className="cursor-pointer text-xl" />
      </div>
    </div>
  );
};

export default Head;
