export const formatViewCount = (viewCount) => {
    if (viewCount >= 1e6) return `${(viewCount / 1e6).toFixed(1)}M`;
    if (viewCount >= 1e3) return `${(viewCount / 1e3).toFixed(1)}K`;
    return viewCount.toString();
  };

 export const formatDate = (publishedAt) => {
    const currentDate = new Date();
    const publishedDate = new Date(publishedAt);
    const timeDifference = currentDate - publishedDate;

    const timeIntervals = [
      { interval: 31536000000, label: "year" },
      { interval: 2592000000, label: "month" },
      { interval: 86400000, label: "day" },
      { interval: 3600000, label: "hour" },
      { interval: 60000, label: "minute" },
      { interval: 1000, label: "second" },
    ];

    for (let i = 0; i < timeIntervals.length; i++) {
      const { interval, label } = timeIntervals[i];
      const count = Math.floor(timeDifference / interval);
      if (count >= 1) {
        return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };