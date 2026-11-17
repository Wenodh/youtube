import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isMenuOpen: window.innerWidth > 768,
    user: null,
    isDarkMode: localStorage.getItem("darkMode") === "true",
    watchLater: JSON.parse(localStorage.getItem("watchLater") || "[]"),
    likedVideos: JSON.parse(localStorage.getItem("likedVideos") || "[]"),
    history: JSON.parse(localStorage.getItem("history") || "[]"),
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
      localStorage.setItem("darkMode", state.isDarkMode);
    },
    addToWatchLater: (state, action) => {
      const exists = state.watchLater.find(v => v.id === action.payload.id);
      if (exists) {
        state.watchLater = state.watchLater.filter(v => v.id !== action.payload.id);
      } else {
        state.watchLater.push(action.payload);
      }
      localStorage.setItem("watchLater", JSON.stringify(state.watchLater));
    },
    toggleLikeVideo: (state, action) => {
      const exists = state.likedVideos.find(v => v.id === (action.payload.id?.videoId || action.payload.id));
      if (exists) {
        state.likedVideos = state.likedVideos.filter(v => (v.id?.videoId || v.id) !== (action.payload.id?.videoId || action.payload.id));
      } else {
        state.likedVideos.push(action.payload);
      }
      localStorage.setItem("likedVideos", JSON.stringify(state.likedVideos));
    },
    addToHistory: (state, action) => {
      const videoId = action.payload.id?.videoId || action.payload.id;
      state.history = [action.payload, ...state.history.filter(v => (v.id?.videoId || v.id) !== videoId)].slice(0, 50);
      localStorage.setItem("history", JSON.stringify(state.history));
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.setItem("history", "[]");
    },
  },
});
export const { toggleMenu, closeMenu, setUser, logout, toggleDarkMode, addToWatchLater, toggleLikeVideo, addToHistory, clearHistory } = appSlice.actions;
export default appSlice.reducer;
