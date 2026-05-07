import React, { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa6";

const ChatMessage = ({ name, message }) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
      <FaUserTie className="text-xl shrink-0 text-gray-400" />
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="font-bold text-gray-500">{name}</span>
        <span className="dark:text-gray-300">{message}</span>
      </div>
    </div>
  );
};

const LiveChat = () => {
  const [messages, setMessages] = useState([
    { name: "John Doe", message: "Wow, this is amazing!" },
    { name: "Jane Smith", message: "Love the new Zen G design!" },
    { name: "Alex Johnson", message: "Infinite scroll is so smooth." },
  ]);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    const i = setInterval(() => {
      // API Polling simulation
      const names = ["User123", "CoolCat", "DevMaster", "YouTubeCloneFan"];
      const texts = ["Hello world!", "Nice video", "How did you do that?", "Keep it up! 🚀", "Subscribe to my channel!"];

      setMessages((prev) => {
        const newMsg = {
          name: names[Math.floor(Math.random() * names.length)],
          message: texts[Math.floor(Math.random() * texts.length)]
        };
        return [newMsg, ...prev].slice(0, 50);
      });
    }, 2000);

    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col h-[450px] border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#0f0f0f] overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 font-bold">
        Live Chat
      </div>
      <div className="flex-grow overflow-y-auto flex flex-col-reverse p-2">
        {messages.map((m, i) => (
          <ChatMessage key={i} name={m.name} message={m.message} />
        ))}
      </div>
      <form
        className="p-3 border-t border-gray-200 dark:border-gray-800 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!liveMessage.trim()) return;
          setMessages(prev => [{ name: "You", message: liveMessage }, ...prev]);
          setLiveMessage("");
        }}
      >
        <input
          type="text"
          placeholder="Say something..."
          className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1 text-sm outline-none"
          value={liveMessage}
          onChange={(e) => setLiveMessage(e.target.value)}
        />
        <button className="text-blue-500 font-bold text-sm">Send</button>
      </form>
    </div>
  );
};

export default LiveChat;
