import { useRef } from "react";

const TagButton = ({ text }) => {
  return (
    <button className="font-semibold rounded-lg bg-gray-300/60 px-4 py-1 text-gray-800 shadow hover:bg-gray-300/90">
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
        className=" text-xl font-bold bg-slate-400/70 text-gray-600 rounded-full hover:bg-slate-400 focus:outline-none absolute py-2 px-4 "
      >
        &larr;
      </button>
      <div
        className="col-span-12 flex gap-2 overflow-x-auto py-4 px-12"
        ref={containerRef}
      >
        {tags.map((tag, index) => (
          <TagButton key={index} text={tag} />
        ))}
      </div>
      <button
        onClick={scrollNext}
        className=" text-xl font-bold bg-slate-400/70 text-gray-600 rounded-full hover:bg-slate-400 focus:outline-none absolute right-0 px-4 py-2"
      >
        &rarr;
      </button>
    </div>
  );
};
export default TagList;
