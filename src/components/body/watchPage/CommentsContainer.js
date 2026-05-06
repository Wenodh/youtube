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
            <span className="text-sm font-bold text-gray-900">
              {authorDisplayName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(publishedAt))} ago
            </span>
          </div>
          <p
            className="text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: textDisplay }}
          />
          <div className="mt-1 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiThumbsUp className="cursor-pointer text-sm" />
              <span className="text-xs text-gray-600">{likeCount > 0 && likeCount}</span>
            </div>
            <FiThumbsDown className="cursor-pointer text-sm" />
            <button className="text-xs font-bold hover:bg-gray-100 px-2 py-1 rounded-full">
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

const CommentsContainer = ({ videoId }) => {
  const [comments, setComments] = useState([]);

  const getComments = useCallback(async () => {
    try {
      const response = await fetch(YOUTUBE_COMMENT_THREADS_API + videoId);
      const data = await response.json();
      setComments(data.items || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      getComments();
    }
  }, [videoId, getComments]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
      <div className="flex flex-col">
        {comments.map((comment) => (
          <Comment key={comment.id} data={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentsContainer;
