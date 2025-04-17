import { Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const YoutubeRefer = () => {
  return (
    <div className="bg-red-500 hover:bg-red-600 text-white text-sm p-3 rounded-xl shadow-lg shadow-red-300 cursor-pointer ">
      <Link
        className="hover:text-white flex gap-1 items-center"
        href={"https://youtube.com/c/@igraphical"}
      >
        <Youtube />
        آموزش های بیشتر در یوتیوب
      </Link>
    </div>
  );
};

export default YoutubeRefer;
