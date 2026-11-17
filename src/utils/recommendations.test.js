import {
  buildRecommendationQuery,
  extractKeywords,
  rankRecommendations,
  scoreRecommendation,
} from "./recommendations";

const makeVideo = (id, title, channelId = "channel-1", publishedAt = "2026-10-01T00:00:00Z") => ({
  id,
  snippet: { title, description: "", channelId, publishedAt },
});

describe("recommendation ranking", () => {
  test("extracts useful keywords and removes common filler words", () => {
    expect(extractKeywords("The Complete React Tutorial for Beginners!"))
      .toEqual(["complete", "react", "tutorial", "beginners"]);
  });

  test("builds a focused search query from the current title", () => {
    expect(buildRecommendationQuery(makeVideo("current", "React performance optimization guide")))
      .toBe("react performance optimization guide");
  });

  test("scores topic-matching candidates above unrelated popular content", () => {
    const currentVideo = makeVideo("current", "React performance optimization hooks");
    const related = makeVideo("related", "React hooks performance tips", "channel-2");
    const unrelated = makeVideo("unrelated", "Cricket world cup highlights", "channel-3");

    expect(scoreRecommendation(related, { currentVideo }))
      .toBeGreaterThan(scoreRecommendation(unrelated, { currentVideo }));
  });

  test("uses viewer interests and excludes current, duplicate, and dismissed videos", () => {
    const currentVideo = makeVideo("current", "Travel in Japan");
    const likedVideo = makeVideo("liked", "TypeScript advanced patterns");
    const matching = makeVideo("matching", "Advanced TypeScript patterns explained", "channel-2");
    const candidates = [
      currentVideo,
      matching,
      matching,
      makeVideo("dismissed", "Japan travel guide", "channel-3"),
      makeVideo("other", "Cooking with vegetables", "channel-4"),
    ];

    const result = rankRecommendations(candidates, {
      currentVideo,
      likedVideos: [likedVideo],
      dismissedIds: ["dismissed"],
    });

    expect(result.map((video) => video.id)).toEqual(["matching", "other"]);
  });

  test("limits repeated creators before filling remaining slots", () => {
    const currentVideo = makeVideo("current", "JavaScript programming");
    const candidates = [
      makeVideo("a", "JavaScript tutorial one", "same"),
      makeVideo("b", "JavaScript tutorial two", "same"),
      makeVideo("c", "JavaScript tutorial three", "same"),
      makeVideo("d", "JavaScript patterns", "different"),
    ];
    const result = rankRecommendations(candidates, { currentVideo }, 4);
    expect(result.map((video) => video.id)).toEqual(["a", "b", "d", "c"]);
  });
});
