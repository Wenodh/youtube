import React, { useEffect, useState, useCallback } from "react";
import { YOUTUBE_COMMENT_THREADS_API } from "../../../utils/constants";
import { formatDistanceToNow } from "date-fns";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

const Comment = ({ data }) => {
  const snippet = data?.snippet?.topLevelComment?.snippet || data?.snippet;
  const {
    authorDisplayName,
    authorProfileImageUrl,
    textDisplay,
    likeCount,
    publishedAt,
  } = snippet;

  const replies = data?.replies?.comments;

  return (
    <div className="py-3">
      <div className="flex gap-3">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={authorProfileImageUrl}
          alt={authorDisplayName}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {authorDisplayName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(publishedAt))} ago
            </span>
          </div>
          <p
            className="text-sm text-gray-800 dark:text-gray-300"
            >
            {snippet?.textOriginal || textDisplay}
          </p>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiThumbsUp className="cursor-pointer text-sm dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{likeCount > 0 && likeCount}</span>
            </div>
            <FiThumbsDown className="cursor-pointer text-sm dark:text-gray-400" />
            <button className="text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-full dark:text-gray-300">
              Reply
            </button>
          </div>
        </div>
      </div>
      {replies && (
        <div className="ml-12 mt-2">
          {replies.map((reply) => (
            <Comment key={reply.id} data={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsContainer = ({ videoId, isVisible }) => {
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getComments = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(YOUTUBE_COMMENT_THREADS_API + encodeURIComponent(videoId), { signal });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error?.message || "Unable to load comments.");
      setComments(Array.isArray(data.items) ? data.items : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Unable to load comments.");
        console.error("Error fetching comments:", requestError);
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return undefined;
    const controller = new AbortController();
    setComments([]);
    setVisibleCount(10);
    getComments(controller.signal);
    return () => controller.abort();
  }, [videoId, getComments]);

  if (!isVisible) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      {isLoading && <p className="py-4 text-sm text-gray-500">Loading comments…</p>}
      {error && <p className="py-4 text-sm text-red-500" role="alert">{error}</p>}
      {!isLoading && !error && comments.length === 0 && <p className="py-4 text-sm text-gray-500">No comments available.</p>}
      <div className="flex flex-col">
        {comments.slice(0, visibleCount).map((comment) => (
          <Comment key={comment.id} data={comment} />
        ))}
      </div>
      {visibleCount < comments.length && (
        <button
          className="w-full mt-4 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-full transition-colors"
          onClick={() => setVisibleCount(prev => prev + 10)}
        >
          Load more
        </button>
      )}
    </div>
  );
};

export default CommentsContainer;
