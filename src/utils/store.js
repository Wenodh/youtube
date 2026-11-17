import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import searchSlice from "./searchSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    search: searchSlice
  },
});

store.subscribe(() => {
  if (typeof localStorage === "undefined") return;
  const { app } = store.getState();
  try {
    localStorage.setItem("darkMode", String(app.isDarkMode));
    localStorage.setItem("watchLater", JSON.stringify(app.watchLater));
    localStorage.setItem("likedVideos", JSON.stringify(app.likedVideos));
    localStorage.setItem("history", JSON.stringify(app.history));
  } catch {
    // Persistence is best-effort; in-memory Redux state remains available.
  }
});

export default store;
