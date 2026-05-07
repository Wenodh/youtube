import { createSlice } from "@reduxjs/toolkit";

const miniPlayerSlice = createSlice({
  name: "miniPlayer",
  initialState: {
    isActive: false,
    videoId: null,
    videoInfo: null,
    isPlaying: true,
  },
  reducers: {
    setMiniPlayerVideo: (state, action) => {
      state.videoId = action.payload.id;
      state.videoInfo = action.payload;
    },
    activateMiniPlayer: (state) => {
      state.isActive = true;
    },
    deactivateMiniPlayer: (state) => {
      state.isActive = false;
      state.videoId = null;
      state.videoInfo = null;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const { setMiniPlayerVideo, activateMiniPlayer, deactivateMiniPlayer, setIsPlaying } = miniPlayerSlice.actions;
export default miniPlayerSlice.reducer;
