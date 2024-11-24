export const LIVE_CHAT_COUNT = 25;

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const BASE_YOUTUBE_API = "https://youtube.googleapis.com/youtube/v3";

export const YOUTUBE_VIDEOS_API = `${BASE_YOUTUBE_API}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=IN&key=${API_KEY}`;

export const YOUTUBE_VIDEOS_SEARCH_API = `${BASE_YOUTUBE_API}/search?part=snippet,statistics&maxResults=20&type=video&key=${API_KEY}&q=`;

export const YOUTUBE_SEARCH_API = "https://suggestqueries.google.com/complete/search";

export const YOUTUBE_VIDEO_BY_ID = `${BASE_YOUTUBE_API}/videos?part=snippet,contentDetails,statistics&key=${API_KEY}&id=`;

// export const YOUTUBE_SEARCH_API = `https://serpapi.com/search.json?engine=google_autocomplete&search_query=`
// export const YOUTUBE_SEARCH_API = `https://clients1.google.com/complete/search`

// export const YOUTUBE_SEARCH_API = `https://serpapi.com/search.json?engine=google_autocomplete&search_query=`
// export const YOUTUBE_SEARCH_API = `https://clients1.google.com/complete/search`
