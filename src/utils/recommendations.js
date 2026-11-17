const STOP_WORDS = new Set(["about","after","again","also","and","are","been","being","between","could","for","from","have","how","into","just","more","most","new","over","some","than","that","the","their","them","then","there","these","they","this","those","through","top","under","very","what","when","where","which","while","with","would","you","your","video","official","full","episode","using","based","best"]);

// Conservative concept groups provide lightweight semantic expansion without a remote model.
const CONCEPT_GROUPS = [
  ["react","reactjs","react.js"], ["javascript","js","ecmascript"], ["typescript","ts"],
  ["frontend","front-end","ui","user-interface"], ["backend","back-end","server-side"],
  ["performance","optimization","optimisation","optimize","optimise","faster","speed","efficient"],
  ["debugging","debug","troubleshooting","fixing","errors"],
  ["tutorial","guide","walkthrough","course","lesson","explained","learning"],
  ["interview","interviews","job-preparation","coding-round"],
  ["database","databases","sql","postgresql","mysql"],
  ["artificial-intelligence","ai","machine-learning","ml","llm","llms"],
  ["design","ui-design","ux","user-experience"], ["security","secure","cybersecurity","vulnerability"],
  ["fitness","workout","exercise","training"], ["nutrition","diet","food","eating"],
  ["finance","investing","investment","stocks","stock-market"], ["chess","chess-game","checkmate"],
  ["music","songs","singing","audio"], ["travel","tourism","destination","trip"],
];
const CONCEPT_BY_TERM = new Map();
CONCEPT_GROUPS.forEach((group, index) => group.forEach((term) => CONCEPT_BY_TERM.set(term, `concept-${index}`)));
const getVideoId = (video) => video?.id?.videoId || video?.id || "";
const normalizeToken = (token) => {
  const normalized = token.toLowerCase().replace(/\.js$/, "");
  if (CONCEPT_BY_TERM.has(normalized)) return CONCEPT_BY_TERM.get(normalized);
  if (normalized.endsWith("ies") && normalized.length > 4) return normalized.slice(0, -3) + "y";
  if (normalized.endsWith("s") && normalized.length > 3) return normalized.slice(0, -1);
  return normalized;
};
const extractRawKeywords = (value = "") => String(value).toLowerCase().normalize("NFKD")
  .replace(/[^a-z0-9]/g, " ").split(" ")
  .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
export const extractKeywords = (value = "") => [...new Set(String(value).toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s.-]/gu, " ").split(/\s+/).map((word) => word.replace(/^[.-]+|[.-]+$/g, "")).filter((word) => word.length > 2 && !STOP_WORDS.has(word)).map(normalizeToken))];
const getText = (video) => [video?.snippet?.title, video?.snippet?.description, video?.snippet?.tags?.join(" ")].filter(Boolean).join(" ");
const cosineSimilarity = (left, right) => {
  if (!left.length || !right.length) return 0;
  const a = new Set(left); const b = new Set(right); let overlap = 0;
  a.forEach((term) => { if (b.has(term)) overlap += 1; });
  return overlap / Math.sqrt(a.size * b.size);
};
const getFreshness = (publishedAt) => {
  if (!publishedAt) return 0.5;
  const ageDays = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 86400000);
  return Number.isFinite(ageDays) ? Math.max(0, 1 - ageDays / 730) : 0.5;
};
const getPreferenceScore = (candidateKeywords, history = [], likedVideos = []) => {
  const preferences = [...likedVideos.map((video) => ({ video, weight: 1.25 })), ...history.slice(0, 15).map((video, index) => ({ video, weight: Math.max(0.35, 1 - index * 0.045) }))];
  const totalWeight = preferences.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight ? preferences.reduce((sum, item) => sum + cosineSimilarity(extractKeywords(getText(item.video)), candidateKeywords) * item.weight, 0) / totalWeight : 0;
};
export const scoreRecommendation = (candidate, { currentVideo, history = [], likedVideos = [] } = {}) => {
  const currentText = getText(currentVideo);
  const candidateText = getText(candidate);
  const lexical = cosineSimilarity(extractRawKeywords(currentText), extractRawKeywords(candidateText));
  // Concept-normalized overlap captures related wording (e.g. speed/performance) without an embedding model.
  const semantic = cosineSimilarity(extractKeywords(currentText), extractKeywords(candidateText));
  const candidateKeywords = extractKeywords(candidateText);
  const interests = getPreferenceScore(candidateKeywords, history, likedVideos);
  return lexical * 0.35 + semantic * 0.30 + interests * 0.30 + getFreshness(candidate?.snippet?.publishedAt) * 0.05;
};
export const getContentSimilarity = (left, right) => cosineSimilarity(extractKeywords(getText(left)), extractKeywords(getText(right)));
export const rankRecommendations = (candidates = [], context = {}, limit = 12) => {
  const currentId = getVideoId(context.currentVideo); const dismissed = new Set(context.dismissedIds || []); const seen = new Set([currentId]);
  const remaining = candidates.filter((video) => { const id = getVideoId(video); if (!id || seen.has(id) || dismissed.has(id)) return false; seen.add(id); return true; }).map((video) => ({ video, relevance: scoreRecommendation(video, context), channelId: video?.snippet?.channelId || "unknown" }));
  const selected = []; const channelCounts = new Map();
  // Maximal marginal relevance penalizes near-duplicate content, not just repeated creators.
  while (remaining.length && selected.length < limit) {
    let bestIndex = 0; let bestScore = -Infinity;
    remaining.forEach((entry, index) => {
      const redundancy = selected.reduce((max, chosen) => Math.max(max, getContentSimilarity(entry.video, chosen.video)), 0);
      const channelPenalty = (channelCounts.get(entry.channelId) || 0) >= 2 ? 0.06 : 0;
      const mmr = entry.relevance - 0.28 * redundancy - channelPenalty;
      if (mmr > bestScore) { bestScore = mmr; bestIndex = index; }
    });
    const [next] = remaining.splice(bestIndex, 1); selected.push(next);
    channelCounts.set(next.channelId, (channelCounts.get(next.channelId) || 0) + 1);
  }
  return selected.map((entry) => entry.video);
};
export const buildRecommendationQuery = (video) => {
  const title = extractRawKeywords(video?.snippet?.title || "");
  const description = extractRawKeywords(video?.snippet?.description || "");
  // Search YouTube with readable natural-language terms, never internal concept IDs.
  return [...new Set([...title.slice(0, 7), ...description])].slice(0, 10).join(" ") || video?.snippet?.title || "";
};
export const getRecommendationVideoId = getVideoId;