import { db } from "./db";

export const downloadService = {
  async addDownload(video) {
    const videoId = video.id?.videoId || video.id;
    const downloadData = {
      id: videoId,
      title: video.snippet?.title,
      thumbnail: video.snippet?.thumbnails?.medium?.url,
      channelTitle: video.snippet?.channelTitle,
      duration: video.contentDetails?.duration,
      viewCount: video.statistics?.viewCount,
      publishedAt: video.snippet?.publishedAt,
      addedAt: Date.now(),
      fullData: video, // Storing full data just in case
    };
    await db.downloads.put(downloadData);
    return downloadData;
  },

  async removeDownload(videoId) {
    await db.downloads.delete(videoId);
  },

  async getAllDownloads() {
    return await db.downloads.orderBy("addedAt").reverse().toArray();
  },

  async isDownloaded(videoId) {
    const download = await db.downloads.get(videoId);
    return !!download;
  },
};
