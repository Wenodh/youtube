const STORAGE_KEY = "youtube.dismissedRecommendations.v1";
const MAX_DISMISSED = 100;

export const getDismissedRecommendations = () => {
  if (typeof localStorage === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.filter((id) => typeof id === "string").slice(-MAX_DISMISSED)
      : [];
  } catch {
    return [];
  }
};

export const dismissRecommendation = (videoId) => {
  if (!videoId || typeof localStorage === "undefined") return getDismissedRecommendations();
  const next = [...new Set([...getDismissedRecommendations(), videoId])].slice(-MAX_DISMISSED);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Dismissal is best-effort when browser storage is unavailable.
  }
  return next;
};
