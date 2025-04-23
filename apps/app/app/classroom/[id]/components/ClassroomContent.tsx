"use client";

import React, { useEffect, useState } from "react";
import CurriculumsList from "./CurriculumsList";
import ClassroomVideo from "./ClassroomVideo";
import {
  Course,
  Curriculum,
  Enrollment,
  Lesson,
  LessonProgress,
} from "@igraph/database";

export interface LessonType extends Lesson {
  lessonProgress: LessonProgress[];
  section: Curriculum;
}

interface CourseType extends Course {
  curriculum: (Curriculum & {
    lessons: LessonType[];
  })[];
}

interface EnrollmentType extends Enrollment {
  course: CourseType;
  lessonProgress: LessonProgress[];
}

const ClassroomContent = ({ enrollment }: { enrollment: EnrollmentType }) => {
  const lessons = enrollment.course.curriculum.flatMap((curr) =>
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
  }, [enrollment.course.curriculum]);

  const totalLessonsCount = enrollment.course.curriculum.reduce(
    (acc, curr) => acc + curr.lessons.length,
    0
  );
  const completedLessonsCount = enrollment.lessonProgress.length;
  const isLastLesson = totalLessonsCount - completedLessonsCount === 1;

  return (
    <>
      <CurriculumsList
        curriculums={enrollment.course.curriculum}
        currentLesson={currentLesson}
        onLessonSelect={setCurrentLesson}
      />
      <ClassroomVideo
        isLastLesson={isLastLesson}
        courseTitle={enrollment.course.title}
        currentLesson={currentLesson}
      />
    </>
  );
};

export default ClassroomContent;
