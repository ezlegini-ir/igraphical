import React from "react";
import TopDataTable from "./TopDataTable";

const TopDataCards = () => {
  return (
    <>
      <TopDataTable
        columns={topEnrolledColumns}
        data={topEnrolledCourses}
        referTo="#"
        title="Top Enrolled Courses"
        className="col-span-3"
      />

      <TopDataTable
        columns={topEnrolledColumns}
        data={topEnrolledCourses}
        referTo="#"
        title="Top Instructor Enrollments"
        className="col-span-3"
      />

      <TopDataTable
        columns={topEnrolledColumns}
        data={topEnrolledCourses}
        referTo="#"
        title="Top Sold Courses"
        className="col-span-3"
      />

      <TopDataTable
        columns={topEnrolledColumns}
        data={topEnrolledCourses}
        referTo="#"
        title="Top Completed Courses"
        className="col-span-3"
      />
    </>
  );
};

export default TopDataCards;

const topEnrolledColumns = [
  { label: "Course", className: "text-left" },
  { label: "Students", className: "w-[50px]" },
];
const topEnrolledCourses = [
  {
    title: "دوره جامع نرم افزار ادوبی ایندیزاین",
    href: "#",
    count: 2415,
  },
  {
    title: "دوره جامع نرم افزار ادوبی ایلوستریتور",
    href: "#2",
    count: 1282,
  },
  {
    title: "دوره جامع طراحی بسته بندی و لیبل",
    href: "#2",
    count: 1282,
  },
];
