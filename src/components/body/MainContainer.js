import React from "react";
import VideoContainer from "./VideoContainer";
import TagList from "./TagList";

const MainContainer = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden pb-20 md:pb-0">
      <TagList />
      <VideoContainer />
    </div>
  );
};

export default MainContainer;
