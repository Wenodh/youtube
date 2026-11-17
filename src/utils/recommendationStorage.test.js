import {
  dismissRecommendation,
  getDismissedRecommendations,
} from "./recommendationStorage";

describe("recommendation dismissal storage", () => {
  beforeEach(() => localStorage.clear());

  test("stores dismissed video ids without duplicates", () => {
    dismissRecommendation("video-1");
    dismissRecommendation("video-1");
    dismissRecommendation("video-2");

    expect(getDismissedRecommendations()).toEqual(["video-1", "video-2"]);
  });

  test("recovers safely from invalid stored JSON", () => {
    localStorage.setItem("youtube.dismissedRecommendations.v1", "{invalid");
    expect(getDismissedRecommendations()).toEqual([]);
  });
});
