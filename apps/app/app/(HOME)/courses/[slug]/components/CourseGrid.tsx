import React from "react";
import CourseCard, { CourseType } from "./CourseCard";

interface Props {
  courses: CourseType[];
}

const CourseGrid = ({ courses }: Props) => {
  return (
    <div className={"grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}>
      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
