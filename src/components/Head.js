import React, { useEffect, useState, useCallback } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoSearchOutline, IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu, setUser, logout } from "../utils/appSlice";
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
  const user = useSelector((store) => store.app.user);

  const parseJwt = useCallback((token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  }, []);

  const handleLoginCallback = useCallback(
    (response) => {
      const userObject = parseJwt(response.credential);
      dispatch(setUser(userObject));
    },
    [dispatch, parseJwt],
  );

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleLoginCallback,
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "medium",
        type: "icon",
        shape: "circle",
      });
    }
  }, [user, handleLoginCallback]);

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
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?q=${searchQuery}`);
                setShowSuggestions(false);
                setIsMobileSearchVisible(false);
              }
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-14 z-10 max-h-[50vh] w-full overflow-y-auto rounded-2xl border border-white/20 bg-white/90 p-1 shadow-2xl backdrop-blur-xl">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="flex items-center gap-4 rounded-xl px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100/80 active:bg-gray-200/80"
                    onMouseDown={(e) => {
                      // Using onMouseDown to trigger before onBlur
                      e.preventDefault();
                      setSearchQuery(suggestion);
                      navigate(`/?q=${suggestion}`);
                      setShowSuggestions(false);
                      setIsMobileSearchVisible(false);
                    }}
                  >
                    <IoSearchOutline className="shrink-0 text-lg text-gray-500" />
                    <span className="line-clamp-1 text-[15px]">{suggestion}</span>
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
    <div className="sticky top-0 z-40 flex items-center justify-between bg-white/80 p-3 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <CiMenuBurger
          onClick={toggleMenuHandler}
          className="hidden cursor-pointer text-xl transition-colors hover:text-red-600 md:block"
        />
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => navigate(`/`)}
        >
          <img
            className="h-5 md:h-6"
            alt="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"
          />
          <span className="text-xl font-bold tracking-tighter hidden md:block">YouTube</span>
        </div>
      </div>

      <div className="relative hidden w-1/2 md:flex md:justify-center">
        <div className="flex w-full max-w-xl shadow-sm transition-shadow focus-within:shadow-md">
          <input
            className="relative w-full rounded-l-full border border-gray-200 bg-gray-50/50 p-2 pl-6 outline-none focus:border-blue-500 focus:bg-white"
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
            className="rounded-r-full border border-l-0 border-gray-200 bg-gray-50 p-2 px-6 transition-colors hover:bg-gray-100"
            onClick={() => {
              if (!searchQuery) return;
              navigate(`/?q=${searchQuery}`);
              setShowSuggestions(false);
            }}
          >
            <IoSearchOutline className="text-lg" />
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-14 z-10 max-h-[60vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/20 bg-white/95 p-1 shadow-2xl backdrop-blur-xl">
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="flex items-center gap-4 rounded-xl px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100/80 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    navigate(`/?q=${suggestion}`);
                    setShowSuggestions(false);
                  }}
                >
                  <IoSearchOutline className="shrink-0 text-lg text-gray-500" />
                  <span className="line-clamp-1 text-[15px]">{suggestion}</span>
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
        {user ? (
          <div className="flex items-center gap-2">
            <img
              className="h-8 w-8 rounded-full cursor-pointer"
              src={user.picture}
              alt="user"
              onClick={() => dispatch(logout())}
              title="Click to logout"
            />
          </div>
        ) : (
          <div id="signInDiv"></div>
        )}
      </div>
    </div>
  );
};

export default Head;
