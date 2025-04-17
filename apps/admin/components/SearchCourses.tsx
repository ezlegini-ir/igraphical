"use client";

import { useEffect, useState } from "react";
import { Course } from "@igraph/database";
import SearchField from "@igraph/ui/components/SearchField";
import { getCourseById } from "@/data/course";
import { searchCourses } from "@/data/search";

const SearchCourses = ({
  field,
  courseId,
  placeHolder,
}: {
  field: any;
  courseId?: number;
  placeHolder?: string;
}) => {
  const [defaultCourse, setDefaultCourse] = useState<Course | undefined>(
    undefined
  );

  const fetchCourses = async (query: string): Promise<Course[]> => {
    return await searchCourses(query);
  };

  useEffect(() => {
    const fetchSelectedCourse = async () => {
      if (courseId) {
        const course = await getCourseById(courseId);
        setDefaultCourse(course ? course : undefined);
      }
    };
    fetchSelectedCourse();
  }, [courseId]);

  return (
    <SearchField<Course>
      placeholder={placeHolder}
      fetchResults={fetchCourses}
      onSelect={(course) =>
        course ? field.onChange(course.id) : field.onChange(undefined)
      }
      getItemLabel={(course) => `${course.title}`}
      defaultItem={defaultCourse}
    />
  );
};

export default SearchCourses;
