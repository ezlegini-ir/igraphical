"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Skeleton } from "@igraph/ui/components/ui/skeleton";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const CurriculumPlay = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);

  return (
    <div className="relative overflow-hidden w-full mx-auto rounded-sm aspect-video">
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}

      <ReactPlayer
        ref={playerRef}
        url={url}
        controls
        width="100%"
        height="100%"
        className="rounded-lg"
        onReady={() => setIsLoading(false)}
      />
    </div>
  );
};

export default CurriculumPlay;
