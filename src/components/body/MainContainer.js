import React from "react";
import VideoContainer from "./VideoContainer";
import TagList from "./TagList";

const MainContainer = () => {
  return (
    <div className="w-full">
      <TagList />
      <VideoContainer />
    </div>
  );
};

export default MainContainer;
