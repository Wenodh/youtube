import { useRef, useState } from "react";

const TagButton = ({ text }) => {
  return (
    <button className="font-base rounded-lg bg-gray-200 px-4 py-1 text-gray-800 shadow hover:bg-gray-400">
      {text}
    </button>
  );
};

const TagList = () => {
  const tags = [
    "All",
    "Gaming",
    "Songs",
    "Live",
    "Gaming",
    "Cricket",
    "Cooking",
    "Soccer",
    "News",
    "Tech",
    "Tutorial",
    "Vlog",
  ];
  const containerRef = useRef(null);

  const scrollNext = () => {
    const container = containerRef.current;
    container.scrollBy({
      left: 150, // Adjust scroll distance as needed
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    const container = containerRef.current;
    container.scrollBy({
      left: -150, // Adjust scroll distance as needed
      behavior: "smooth",
    });
  };
  return (
    <div className="grid grid-cols-12 items-center justify-center">
      <button
        onClick={scrollPrev}
        className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        &larr;
      </button>
      <div
        className="col-span-10 flex gap-2 overflow-x-auto py-4"
        ref={containerRef}
      >
        {tags.map((tag, index) => (
          <TagButton key={index} text={tag} />
        ))}
      </div>
      <button
        onClick={scrollNext}
        className="col-span-1 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        &rarr;
      </button>
    </div>
  );
};
export default TagList;
