export const formatViewCount = (viewCount) => {
  const count = Number(viewCount);
  if (!Number.isFinite(count) || count < 0) return "0";
  if (count >= 1e9) return `${(count / 1e9).toFixed(1)}B`;
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K`;
  return Math.floor(count).toString();
};

export const formatDate = (publishedAt) => {
  if (!publishedAt) return "";
  const publishedDate = new Date(publishedAt);
  if (Number.isNaN(publishedDate.getTime())) return "";
  const timeDifference = Math.max(0, Date.now() - publishedDate.getTime());
  const timeIntervals = [
    { interval: 31536000000, label: "year" },
    { interval: 2592000000, label: "month" },
    { interval: 86400000, label: "day" },
    { interval: 3600000, label: "hour" },
    { interval: 60000, label: "minute" },
    { interval: 1000, label: "second" },
  ];
  for (const { interval, label } of timeIntervals) {
    const count = Math.floor(timeDifference / interval);
    if (count >= 1) return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
  }
  return "Just now";
};
