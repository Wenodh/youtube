import appReducer, {
  addToHistory,
  addToWatchLater,
  clearHistory,
  toggleLikeVideo,
} from "./utils/appSlice";

const initialState = {
  isMenuOpen: false,
  user: null,
  isDarkMode: false,
  watchLater: [],
  likedVideos: [],
  history: [],
};

const video = { id: "video-123", snippet: { title: "Test video" } };

describe("appSlice video library reducers", () => {
  test("adds a video to watch history and clears history", () => {
    const state = appReducer(initialState, addToHistory(video));
    expect(state.history).toEqual([video]);
    expect(appReducer(state, clearHistory()).history).toEqual([]);
  });

  test("toggles watch-later and liked videos", () => {
    const saved = appReducer(initialState, addToWatchLater(video));
    expect(saved.watchLater).toEqual([video]);
    expect(appReducer(saved, addToWatchLater(video)).watchLater).toEqual([]);

    const liked = appReducer(initialState, toggleLikeVideo(video));
    expect(liked.likedVideos).toEqual([video]);
    expect(appReducer(liked, toggleLikeVideo(video)).likedVideos).toEqual([]);
  });
});
