import { buildRecommendationQuery, extractKeywords, getContentSimilarity, rankRecommendations, scoreRecommendation } from "./recommendations";
const makeVideo = (id, title, channelId = "channel-1", description = "") => ({ id, snippet: { title, description, channelId, publishedAt: "2026-10-01T00:00:00Z" } });
describe("recommendation relevance and diversity", () => {
  test("normalizes related wording into shared concepts", () => {
    expect(extractKeywords("React performance optimization")).toContain("concept-5");
    expect(getContentSimilarity(makeVideo("a","React performance optimization"), makeVideo("b","React speed improvements"))).toBeGreaterThan(0.5);
  });
  test("builds a query from title and description terms", () => {
    const query = buildRecommendationQuery(makeVideo("x","React performance guide","c","profiling hooks and rendering"));
    expect(query).toContain("react");
    expect(query).toContain("performance");
    expect(query).not.toContain("concept-");
  });
  test("ranks relevant topics above unrelated content", () => {
    const current = makeVideo("current","React performance optimization hooks");
    expect(scoreRecommendation(makeVideo("a","React rendering speed tips"),{currentVideo:current})).toBeGreaterThan(scoreRecommendation(makeVideo("b","Cricket world cup highlights"),{currentVideo:current}));
  });
  test("uses liked videos to personalize ranking", () => {
    const current = makeVideo("current","Travel in Japan"); const liked = makeVideo("liked","TypeScript advanced patterns");
    expect(scoreRecommendation(makeVideo("a","Advanced TypeScript patterns explained"),{currentVideo:current,likedVideos:[liked]})).toBeGreaterThan(scoreRecommendation(makeVideo("b","Cooking vegetables"),{currentVideo:current,likedVideos:[liked]}));
  });
  test("filters current, duplicate and dismissed videos", () => {
    const current = makeVideo("current","React performance"); const match = makeVideo("match","React performance tips");
    const result = rankRecommendations([current,match,match,makeVideo("dismissed","React performance guide")],{currentVideo:current,dismissedIds:["dismissed"]});
    expect(result.map((video) => video.id)).toEqual(["match"]);
  });
  test("diversifies content even when all candidates share a channel", () => {
    const current = makeVideo("current","React performance optimization");
    const close = makeVideo("close","React performance optimization tutorial","same");
    const angle = makeVideo("angle","React profiling and browser rendering","same");
    const other = makeVideo("other","JavaScript event loop and rendering speed","same");
    const result = rankRecommendations([close,angle,other],{currentVideo:current},3);
    expect(result).toHaveLength(3); expect(result[0].id).toBe("close"); expect(result[1].id).not.toBe("close");
  });
  test("does not reward same-channel videos over more relevant videos", () => {
    const current = makeVideo("current","React performance optimization");
    expect(scoreRecommendation(makeVideo("relevant","React performance guide","other"),{currentVideo:current})).toBeGreaterThan(scoreRecommendation(makeVideo("unrelated","Cricket highlights","channel-1"),{currentVideo:current}));
  });
});