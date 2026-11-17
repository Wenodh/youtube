import { clearYouTubeApiCache, fetchYouTubeJson } from "./youtubeApi";

jest.mock("./constants", () => ({ isYouTubeApiConfigured: true }));

describe("fetchYouTubeJson", () => {
  beforeEach(() => { clearYouTubeApiCache(); global.fetch = jest.fn(); });

  test("caches successful responses for the configured TTL", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ items: [1] }) });
    await expect(fetchYouTubeJson("https://example.test/videos", { ttlMs: 1000 })).resolves.toEqual({ items: [1] });
    await fetchYouTubeJson("https://example.test/videos", { ttlMs: 1000 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("does not cache API errors", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 403, json: async () => ({ error: { message: "Forbidden" } }) });
    await expect(fetchYouTubeJson("https://example.test/videos")).rejects.toThrow("API access was denied");
    await expect(fetchYouTubeJson("https://example.test/videos")).rejects.toThrow("API access was denied");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("surfaces quota exhaustion clearly", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 403, json: async () => ({ error: { errors: [{ reason: "quotaExceeded" }] } }) });
    await expect(fetchYouTubeJson("https://example.test/videos")).rejects.toThrow("quota has been reached");
  });
});
