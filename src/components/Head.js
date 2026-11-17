import React, { useEffect, useState, useCallback, useRef } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoSearchOutline, IoArrowBackOutline, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu, setUser, logout, toggleDarkMode } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import { cacheResults } from "../utils/searchSlice";
import { useNavigate, useLocation } from "react-router-dom";

const readSearchHistory = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const Head = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const searchCache = useSelector((store) => store.search);
  const user = useSelector((store) => store.app.user);
  const isDarkMode = useSelector((store) => store.app.isDarkMode);
  const [searchHistory, setSearchHistory] = useState(readSearchHistory);
  const suggestionRequestId = useRef(0);

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

      const signInDiv = document.getElementById("signInDiv");
      if (signInDiv) {
        google.accounts.id.renderButton(signInDiv, {
          theme: "outline",
          size: "medium",
          type: "icon",
          shape: "circle",
        });
      }
    }
  }, [user, handleLoginCallback]);

  const getSearchSuggestions = useCallback(async () => {
    const query = searchQuery.trim();
    const requestId = ++suggestionRequestId.current;
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios({
        url: YOUTUBE_SEARCH_API,
        adapter: jsonpAdapter,
        params: { client: "youtube", hl: "en", ds: "yt", q: query },
      });
      const data = Array.isArray(res.data?.[1])
        ? res.data[1].map((item) => item?.[0]).filter(Boolean)
        : [];
      if (requestId !== suggestionRequestId.current) return;
      dispatch(cacheResults({ [query]: data }));
      setSuggestions(data);
    } catch (error) {
      if (requestId === suggestionRequestId.current) setSuggestions([]);
      console.error("Unable to load search suggestions:", error);
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      suggestionRequestId.current += 1;
      setSuggestions([]);
      return undefined;
    }
    const timer = setTimeout(() => {
      if (searchCache[query]) setSuggestions(searchCache[query]);
      else getSearchSuggestions();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchCache, getSearchSuggestions]);

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  const isShortsPage = location.pathname === "/shorts";

  const addToHistory = (q) => {
    const normalizedQuery = q.trim();
    if (!normalizedQuery) return;
    setSearchHistory((previous) => {
      const nextHistory = [normalizedQuery, ...previous.filter((item) => item !== normalizedQuery)].slice(0, 10);
      try { localStorage.setItem("searchHistory", JSON.stringify(nextHistory)); } catch { /* Storage may be unavailable. */ }
      return nextHistory;
    });
  };

  if (isMobileSearchVisible) {
    return (
      <div className="flex items-center gap-2 p-4 shadow-xl md:hidden bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        <IoArrowBackOutline
          className="cursor-pointer text-2xl"
          onClick={() => setIsMobileSearchVisible(false)}
        />
        <div className="relative flex flex-grow">
          <input
            className="w-full rounded-full border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 px-4 outline-none text-black dark:text-white"
            type="text"
            placeholder="Search"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                addToHistory(searchQuery);
                setShowSuggestions(false);
                setIsMobileSearchVisible(false);
              }
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-14 z-10 max-h-[50vh] w-full overflow-y-auto rounded-2xl border border-white/20 dark:border-gray-800 bg-white/90 dark:bg-[#0f0f0f]/90 p-1 shadow-2xl backdrop-blur-xl">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="flex items-center gap-4 rounded-xl px-4 py-2.5 font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-800/80 active:bg-gray-200/80"
                    onMouseDown={(e) => {
                      // Using onMouseDown to trigger before onBlur
                      e.preventDefault();
                      setSearchQuery(suggestion);
                      navigate(`/?q=${encodeURIComponent(suggestion)}`);
                      addToHistory(suggestion);
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

  const removeHistory = (e, q) => {
    e.stopPropagation();
    setSearchHistory(prev => {
      const newHist = prev.filter(h => h !== q);
      try { localStorage.setItem("searchHistory", JSON.stringify(newHist)); } catch { /* Storage may be unavailable. */ }
      return newHist;
    });
  };

  return (
    <div className={`sticky top-0 z-40 flex items-center justify-between bg-white/80 dark:bg-[#0f0f0f]/80 p-3 backdrop-blur-md md:px-6 ${isShortsPage ? 'hidden md:flex' : ''}`}>
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
            className="relative w-full rounded-l-full border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-2 pl-6 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 text-black dark:text-white"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                addToHistory(searchQuery);
                setShowSuggestions(false);
              }
            }}
          />
          <button
            className="rounded-r-full border border-l-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 px-6 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              if (!searchQuery) return;
              navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
              addToHistory(searchQuery);
              setShowSuggestions(false);
            }}
          >
            <IoSearchOutline className="text-lg" />
          </button>
        </div>
        {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <div className="absolute top-14 z-10 max-h-[60vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/20 dark:border-gray-800 bg-white/95 dark:bg-[#0f0f0f]/95 p-1 shadow-2xl backdrop-blur-xl">
            <ul>
              {!searchQuery && searchHistory.map((h) => (
                <li
                  key={h}
                  className="flex items-center justify-between rounded-xl px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-800/80 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(h);
                    navigate(`/?q=${encodeURIComponent(h)}`);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <IoSearchOutline className="shrink-0 text-lg text-gray-500" />
                    <span className="line-clamp-1 text-[15px]">{h}</span>
                  </div>
                  <button
                    onClick={(e) => removeHistory(e, h)}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="flex items-center gap-4 rounded-xl px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-800/80 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    navigate(`/?q=${encodeURIComponent(suggestion)}`);
                    addToHistory(suggestion);
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
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <IoSunnyOutline className="text-xl" /> : <IoMoonOutline className="text-xl" />}
        </button>
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
