import React from "react";
import CourseTitle from "./CourseTitle";
import { Star } from "lucide-react";
import Image from "next/image";
import { CourseCategory } from "@igraph/database";
import { placeHolder } from "@/public";

interface Props {
  courseInfo: {
    imageSrc: string | undefined;
    rate: number;
    title: string;
    category: CourseCategory | null;
  };
}

const CourseBanner = ({ courseInfo }: Props) => {
  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center justify-between">
        <CourseTitle title={courseInfo.title} category={courseInfo.category!} />
        <div className="flex gap-2">
          <span className="font-semibold">{courseInfo.rate}</span>
          <Star size={20} className="text-orange-400" />
        </div>
      </div>
      <div>
        <Image
          alt=""
          src={courseInfo.imageSrc || placeHolder}
          width={900}
          height={900}
          className="rounded-lg h-[300px] object-cover"
        />
      </div>
    </div>
  );
};

export default CourseBanner;
