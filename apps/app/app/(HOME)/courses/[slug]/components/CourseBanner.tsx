import React from "react";
import CourseTitle from "./CourseTitle";
import { Star } from "lucide-react";
import Image from "next/image";
import { CourseCategory, Review } from "@igraph/database";
import { placeHolder } from "@/public";
import { calculateCourseRate } from "@igraph/utils";

export interface CourseInfo {
  imageSrc: string | undefined;
  reviews: Review[];
  title: string;
  category: CourseCategory | null;
}

interface CourseBannerProps {
  courseInfo: CourseInfo;
}

const CourseBanner = ({ courseInfo }: CourseBannerProps) => {
  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center justify-between">
        <CourseTitle title={courseInfo.title} category={courseInfo.category!} />
        <div className="flex gap-2">
          <span className="font-semibold">
            {calculateCourseRate(courseInfo.reviews)}
          </span>
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
