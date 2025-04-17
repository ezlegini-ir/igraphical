"use client";

import React, { useEffect, useState } from "react";
import CurriculumsList from "./CurriculumsList";
import ClassroomVideo from "./ClassroomVideo";
import { Course, Curriculum, Lesson, LessonProgress } from "@igraph/database";

interface CourseType extends Course {
  curriculum: (Curriculum & {
    lessons: LessonType[];
  })[];
}

export interface LessonType extends Lesson {
  lessonProgress: LessonProgress[];
  section: Curriculum;
}

const ClassroomContent = ({ course }: { course: CourseType }) => {
  const lessons = course.curriculum.flatMap((curr) =>
    curr.lessons.map((less) => less)
  );

  const [currentLesson, setCurrentLesson] = useState(() => {
    return (
      lessons.find((less) => less.lessonProgress.length === 0) ||
      lessons[lessons.length - 1]
    );
  });

  useEffect(() => {
    const nextLesson = lessons.find((less) => less.lessonProgress.length === 0);
    if (nextLesson && nextLesson.id !== currentLesson.id) {
      setCurrentLesson(nextLesson);
    }
    if (!nextLesson) {
      setCurrentLesson(lessons[lessons.length - 1]);
    }
  }, [course.curriculum]);

  return (
    <>
      <CurriculumsList
        curriculums={course.curriculum}
        currentLesson={currentLesson}
        onLessonSelect={setCurrentLesson}
      />
      <ClassroomVideo
        courseTitle={course.title}
        currentLesson={currentLesson}
      />
    </>
  );
};

export default ClassroomContent;
