import { useState, useEffect, useCallback } from "react";
import { downloadService } from "../utils/downloadService";

export const useDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    const allDownloads = await downloadService.getAllDownloads();
    setDownloads(allDownloads);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const addDownload = useCallback(async (video) => {
    await downloadService.addDownload(video);
    await fetchDownloads();
  }, [fetchDownloads]);

  const removeDownload = useCallback(async (videoId) => {
    await downloadService.removeDownload(videoId);
    await fetchDownloads();
  }, [fetchDownloads]);

  const isDownloaded = useCallback(async (videoId) => {
    return await downloadService.isDownloaded(videoId);
  }, []);

  const getDownload = useCallback(async (videoId) => {
    return await downloadService.getDownload(videoId);
  }, []);

  return {
    downloads,
    loading,
    addDownload,
    removeDownload,
    isDownloaded,
    getDownload,
    refreshDownloads: fetchDownloads,
  };
};
