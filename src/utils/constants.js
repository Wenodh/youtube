export const LIVE_CHAT_COUNT = 25;

export const YOUTUBE_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=" +
  process.env.REACT_APP_GOOGLE_API_KEY;

export const YOUTUBE_SEARCH_API =
  "https://suggestqueries.google.com/complete/search";

  export const YOUTUBE_VIDEO_BY_ID = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=${process.env.REACT_APP_GOOGLE_API_KEY}&id=`;

// export const YOUTUBE_SEARCH_API = `https://serpapi.com/search.json?engine=google_autocomplete&search_query=`
// export const YOUTUBE_SEARCH_API = `https://clients1.google.com/complete/search`