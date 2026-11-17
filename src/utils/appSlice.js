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
      const exists = state.watchLater.find(v => v.id === action.payload.id);
      if (exists) {
        state.watchLater = state.watchLater.filter(v => v.id !== action.payload.id);
      } else {
        state.watchLater.push(action.payload);
      }

    },
    toggleLikeVideo: (state, action) => {
      const exists = state.likedVideos.find(v => v.id === (action.payload.id?.videoId || action.payload.id));
      if (exists) {
        state.likedVideos = state.likedVideos.filter(v => (v.id?.videoId || v.id) !== (action.payload.id?.videoId || action.payload.id));
      } else {
        state.likedVideos.push(action.payload);
      }

    },
    addToHistory: (state, action) => {
      const videoId = action.payload.id?.videoId || action.payload.id;
      state.history = [action.payload, ...state.history.filter(v => (v.id?.videoId || v.id) !== videoId)].slice(0, 50);

    },
    clearHistory: (state) => {
      state.history = [];

    },
  },
});
export const { toggleMenu, closeMenu, setUser, logout, toggleDarkMode, addToWatchLater, toggleLikeVideo, addToHistory, clearHistory } = appSlice.actions;
export default appSlice.reducer;
