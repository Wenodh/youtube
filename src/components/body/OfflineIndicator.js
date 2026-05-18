import React, { useEffect, useState } from "react";
import { useOfflineStatus } from "../../hooks/useOfflineStatus";
import { MdCloudOff, MdCloudDone } from "react-icons/md";

const OfflineIndicator = () => {
  const isOffline = useOfflineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (!isOffline) {
      setShowBackOnline(true);
      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (isOffline) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg border border-gray-700 animate-bounce">
        <MdCloudOff className="text-xl" />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    );
  }

  if (showBackOnline) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg border border-green-500 transition-opacity duration-500">
        <MdCloudDone className="text-xl" />
        <span className="text-sm font-medium">Back online</span>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;
