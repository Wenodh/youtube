import React from "react";
import { FiMessageSquare } from "react-icons/fi";

const LiveChat = () => (
  <section className="flex h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-[#0f0f0f]" aria-label="Live chat status">
    <FiMessageSquare className="text-3xl text-gray-400" />
    <h2 className="font-bold">Live chat isn't connected yet</h2>
    <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
      Reading or sending YouTube live-chat messages requires Google OAuth authorization and the YouTube Live Streaming API. This app does not currently request those permissions.
    </p>
  </section>
);
export default LiveChat;
