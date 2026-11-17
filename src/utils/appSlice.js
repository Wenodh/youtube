import { createSlice } from "@reduxjs/toolkit";

const readStoredArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const readStoredBoolean = (key) => {
  try { return localStorage.getItem(key) === "true"; } catch { return false; }
};

const getVideoId = (video) => video?.id?.videoId || video?.id;

const appSlice = createSlice({
  name: "app",
  initialState: {
    isMenuOpen: typeof window !== "undefined" ? window.innerWidth > 768 : false,
    user: null,
    isDarkMode: readStoredBoolean("darkMode"),
    watchLater: readStoredArray("watchLater"),
    likedVideos: readStoredArray("likedVideos"),
    history: readStoredArray("history"),
  },
  reducers: {
    toggleMenu: (state, action) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;

    },
    addToWatchLater: (state, action) => {
      const videoId = getVideoId(action.payload);
      const exists = state.watchLater.some((video) => getVideoId(video) === videoId);
      if (exists) {
        state.watchLater = state.watchLater.filter((video) => getVideoId(video) !== videoId);
      } else {
        state.watchLater.push(action.payload);
      }

    },
    toggleLikeVideo: (state, action) => {
      const videoId = getVideoId(action.payload);
      const exists = state.likedVideos.some((video) => getVideoId(video) === videoId);
      if (exists) {
        state.likedVideos = state.likedVideos.filter((video) => getVideoId(video) !== videoId);
      } else {
        state.likedVideos.push(action.payload);
      }

    },
    addToHistory: (state, action) => {
      const videoId = getVideoId(action.payload);
      state.history = [action.payload, ...state.history.filter(v => getVideoId(v) !== videoId)].slice(0, 50);

    },
    clearHistory: (state) => {
      state.history = [];

    },
  },
});
export const { toggleMenu, closeMenu, setUser, logout, toggleDarkMode, addToWatchLater, toggleLikeVideo, addToHistory, clearHistory } = appSlice.actions;
export default appSlice.reducer;
