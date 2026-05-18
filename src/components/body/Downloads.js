import React from "react";
import { useDownloads } from "../../hooks/useDownloads";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";
import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";

const Downloads = () => {
  const { downloads, loading, removeDownload } = useDownloads();

  if (loading) {
    return <div className="p-4 md:p-8">Loading downloads...</div>;
  }

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="flex items-center gap-4 mb-6">
        <MdOutlineFileDownload className="text-3xl" />
        <h1 className="text-2xl font-bold">Downloads</h1>
      </div>

      {downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <MdOutlineFileDownload className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No downloaded videos yet.</p>
          <p className="text-gray-400 text-sm">Videos you download will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {downloads.map((video) => (
            <div key={video.id} className="relative group">
              <Link to={"/watch?v=" + video.id}>
                <VideoCard info={video.fullData} />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeDownload(video.id);
                }}
                className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove download"
              >
                <MdDeleteOutline className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
