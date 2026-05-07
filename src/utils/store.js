import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import searchSlice from "./searchSlice";
import miniPlayerSlice from "./miniPlayerSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    search: searchSlice,
    miniPlayer: miniPlayerSlice,
  },
});

export default store;
