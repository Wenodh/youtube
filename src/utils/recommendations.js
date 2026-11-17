const STOP_WORDS = new Set([
  "about", "after", "again", "also", "been", "being", "between", "could",
  "from", "have", "into", "just", "more", "most", "over", "some", "than",
  "that", "their", "them", "then", "there", "these", "they", "this", "those",
  "through", "under", "very", "what", "when", "where", "which", "while",
  "with", "would", "your", "video", "official", "full", "episode",
]);

const getVideoId = (video) => video?.id?.videoId || video?.id || "";

export const extractKeywords = (value = "") => {
  const words = String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
  return [...new Set(words)];
};

const similarity = (left, right) => {
  if (!left.length || !right.length) return 0;
  const rightSet = new Set(right);
  const overlap = left.reduce((count, word) => count + Number(rightSet.has(word)), 0);
  return overlap / Math.sqrt(left.length * right.length);
};

const getText = (video) => [
  video?.snippet?.title,
  video?.snippet?.description,
  video?.snippet?.tags?.join(" "),
].filter(Boolean).join(" ");

const getFreshness = (publishedAt) => {
  if (!publishedAt) return 0.35;
  const ageDays = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 86_400_000);
  if (!Number.isFinite(ageDays)) return 0.35;
  return Math.max(0, 1 - ageDays / 730);
};

export const scoreRecommendation = (candidate, {
  currentVideo,
  history = [],
  likedVideos = [],
} = {}) => {
  const currentKeywords = extractKeywords(getText(currentVideo));
  const candidateKeywords = extractKeywords(getText(candidate));
  const topicScore = similarity(currentKeywords, candidateKeywords);

  const preferenceVideos = [
    ...likedVideos.map((video) => ({ video, weight: 1.25 })),
    ...history.slice(0, 12).map((video, index) => ({ video, weight: Math.max(0.45, 1 - index * 0.045) })),
  ];
  const interestScore = preferenceVideos.reduce((best, entry) => {
    return Math.max(best, similarity(
      extractKeywords(videoText(entry.video)),
      candidateKeywords,
    ) * entry.weight);
  }, 0);
  const sameChannel = Boolean(
    currentVideo?.snippet?.channelId &&
    currentVideo.snippet.channelId === candidate?.snippet?.channelId
  );
  const channelScore = sameChannel ? 1 : 0;
  const freshnessScore = getFreshness(candidate?.snippet?.publishedAt);

  return (topicScore * 0.62) +
    (Math.min(1, interestScore) * 0.23) +
    (channelScore * 0.05) +
    (freshnessScore * 0.10);
};

function videoText(video) {
  return getText(video);
}

export const rankRecommendations = (candidates = [], context = {}, limit = 12) => {
  const currentId = getVideoId(context.currentVideo);
  const dismissed = new Set(context.dismissedIds || []);
  const seen = new Set([currentId]);
  const ranked = candidates
    .filter((video) => {
      const id = getVideoId(video);
      if (!id || seen.has(id) || dismissed.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((video) => ({
      video,
      score: scoreRecommendation(video, context),
    }))
    .sort((a, b) => b.score - a.score);

  // Keep the list varied: no more than two videos from one channel in a row/list.
  const result = [];
  const deferred = [];
  const channelCounts = new Map();
  ranked.forEach((entry) => {
    const channelId = entry.video?.snippet?.channelId || "unknown";
    if ((channelCounts.get(channelId) || 0) >= 2) {
      deferred.push(entry);
      return;
    }
    channelCounts.set(channelId, (channelCounts.get(channelId) || 0) + 1);
    result.push(entry.video);
  });

  return [...result, ...deferred.map((entry) => entry.video)].slice(0, limit);
};

export const buildRecommendationQuery = (video) => {
  const title = video?.snippet?.title || "";
  const keywords = extractKeywords(title).slice(0, 8);
  return (keywords.length ? keywords : extractKeywords(getText(video)).slice(0, 6)).join(" ") || title;
};

export const getRecommendationVideoId = getVideoId;
