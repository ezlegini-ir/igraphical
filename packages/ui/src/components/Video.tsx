"use client";

import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { Skeleton } from "@igraph/ui/components/ui/skeleton";

interface VideoProps {
  src: string;
  poster?: string;
}

const Video: React.FC<VideoProps> = ({ src, poster }) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const player = useRef<Player | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Wait for client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && videoNode.current) {
      player.current = videojs(videoNode.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        playsinline: true,
        poster,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          fullscreenToggle: true,
          pictureInPictureToggle: false,
        },
        sources: [{ src }],
        width: 640,
        height: 360,
      });

      player.current.on("canplay", () => {
        setIsLoading(false);
      });
    }

    return () => {
      if (player.current) {
        player.current.dispose();
        player.current = null;
      }
    };
  }, [isMounted, src, poster]);

  return (
    <div className="max-w-4xl mx-auto rounded-sm overflow-hidden">
      <div className="relative aspect-video">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Skeleton />
          </div>
        )}

        {isMounted && (
          <div data-vjs-player className="absolute inset-0">
            <video
              ref={videoNode}
              className="video-js w-full h-full"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              autoPlay
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
