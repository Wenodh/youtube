import React, { useEffect, useState } from "react";
import { YOUTUBE_COMMENT_THREADS_API } from "../../../utils/constants";
import { fetchYouTubeJson } from "../../../utils/youtubeApi";
import { formatDistanceToNow } from "date-fns";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

const getPlainCommentText = (value) => {
  if (typeof value !== "string") return "";
  const parser = new DOMParser();
  return parser.parseFromString(value, "text/html").body.textContent || "";
};

const Comment = ({ data }) => {
  const snippet = data?.snippet?.topLevelComment?.snippet || data?.snippet || {};
  const { authorDisplayName, authorProfileImageUrl, textDisplay, textOriginal, likeCount, publishedAt } = snippet;
  const replies = data?.replies?.comments || [];
  return (
    <article className="py-3">
      <div className="flex gap-3">
        {authorProfileImageUrl ? <img className="h-10 w-10 rounded-full object-cover" src={authorProfileImageUrl} alt="" loading="lazy" /> : <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true" />}
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{authorDisplayName || "YouTube user"}</span>
            {publishedAt && !Number.isNaN(Date.parse(publishedAt)) && <span className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(new Date(publishedAt))} ago</span>}
          </div>
          <p className="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-300">{textOriginal || getPlainCommentText(textDisplay)}</p>
          <div className="mt-1 flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1"><FiThumbsUp className="text-sm" /><span className="text-xs">{likeCount || 0}</span></span>
            <FiThumbsDown className="text-sm" aria-hidden="true" />
          </div>
        </div>
      </div>
      {replies.length > 0 && <div className="ml-12 mt-2 border-l border-gray-200 pl-3 dark:border-gray-800">{replies.map((reply) => <Comment key={reply.id} data={reply} />)}</div>}
    </article>
  );
};

const CommentsContainer = ({ videoId, isVisible }) => {
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoId || !isVisible) return undefined;
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchYouTubeJson(YOUTUBE_COMMENT_THREADS_API + encodeURIComponent(videoId), { signal: controller.signal, ttlMs: 120_000 });
        if (!controller.signal.aborted) { setComments(data.items || []); setVisibleCount(10); }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unable to load comments.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [videoId, isVisible]);

  if (!isVisible) return null;
  return (
    <section className="mt-6" aria-busy={isLoading}>
      <h2 className="mb-4 text-xl font-bold">Comments</h2>
      {isLoading && <p className="py-4 text-sm text-gray-500" role="status">Loading comments…</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}
      {!isLoading && !error && comments.length === 0 && <p className="py-4 text-sm text-gray-500">No public comments found.</p>}
      <div className="flex flex-col">{comments.slice(0, visibleCount).map((comment) => <Comment key={comment.id} data={comment} />)}</div>
      {visibleCount < comments.length && <button className="mt-4 w-full rounded-full py-2 font-bold text-blue-600 hover:bg-blue-50" onClick={() => setVisibleCount((count) => count + 10)}>Load more</button>}
    </section>
  );
};
export default CommentsContainer;
