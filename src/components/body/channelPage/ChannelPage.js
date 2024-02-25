import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { closeMenu } from "../../../utils/appSlice";

const ChannelPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(closeMenu());
  }, []);
  return (
    <div className="grid w-full grid-cols-12 p-4">
      <div className="col-span-full md:col-span-12">
        channel details coming soon
      </div>
      {/* <div className="col-span-full md:col-span-9">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${searchParams.get("v")}`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="col-span-full md:col-span-3">
        {" "}
        recommendations {searchParams?.get("v")}
      </div> */}
    </div>
  );
};

export default ChannelPage;
