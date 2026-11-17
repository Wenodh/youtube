import { isYouTubeApiConfigured } from "./constants";

const responseCache = new Map();
const MAX_CACHE_ENTRIES = 100;

export const fetchYouTubeJson = async (url, { signal, ttlMs = 60_000 } = {}) => {
  if (!isYouTubeApiConfigured) throw new Error("YouTube API key is missing. Add REACT_APP_GOOGLE_API_KEY to your environment.");
  if (signal?.aborted) { const error = new Error("Request cancelled."); error.name = "AbortError"; throw error; }
  const key = String(url);
  const cached = responseCache.get(key);
  if (cached?.expiresAt > Date.now()) return cached.data;
  if (cached) responseCache.delete(key);

  const response = await fetch(key, { signal });
  let data;
  try { data = await response.json(); }
  catch { throw new Error("YouTube returned an invalid response."); }
  if (!response.ok || data?.error) {
    const reason = data?.error?.errors?.[0]?.reason;
    if (["quotaExceeded", "dailyLimitExceeded", "rateLimitExceeded"].includes(reason)) throw new Error("YouTube API quota has been reached. Please try again later.");
    if (response.status === 403) throw new Error("YouTube API access was denied. Check API key restrictions and enabled APIs.");
    throw new Error(data?.error?.message || "The YouTube request failed.");
  }
  if (signal?.aborted) { const error = new Error("Request cancelled."); error.name = "AbortError"; throw error; }
  if (ttlMs > 0) {
    responseCache.set(key, { data, expiresAt: Date.now() + ttlMs });
    if (responseCache.size > MAX_CACHE_ENTRIES) responseCache.delete(responseCache.keys().next().value);
  }
  return data;
};

export const clearYouTubeApiCache = () => responseCache.clear();
