"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@igraph/ui/components/ui/skeleton";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const TizerVideo = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  return (
    <div className="relative overflow-hidden w-full max-w-2xl mx-auto rounded-lg aspect-video">
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}

      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        controls={playing}
        width="100%"
        height="100%"
        className="rounded-lg"
        onReady={() => setIsLoading(false)} // Hide Skeleton when ready
      />

      {/* Custom Play Button */}
      {!playing && (
        <button
          className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 group"
          onClick={() => setPlaying(true)}
        >
          <div className="w-12 h-12 bg-black opacity-65 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Play size={22} className="text-white" />
          </div>
          <p className="text-white">مشاهده تیزر</p>
        </button>
      )}
    </div>
  );
};

export default TizerVideo;
