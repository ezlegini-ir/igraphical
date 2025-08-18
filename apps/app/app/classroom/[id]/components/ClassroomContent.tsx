"use client";

import AskTutorForm from "@/components/forms/AskTutorForm";
import { placeHolder } from "@/public";
import {
  AskTutor,
  AskTutorMessages,
  ClassRoom,
  Course,
  Curriculum,
  Enrollment,
  File,
  Image as ImageType,
  Lesson,
  LessonProgress,
  Tutor,
  User,
} from "@igraph/database";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Progress } from "@igraph/ui/components/ui/progress";
import { Separator } from "@igraph/ui/components/ui/separator";
import Image from "next/image";
import { useEffect, useState } from "react";
import AskTutorChat from "./AskTutorChat";
import ClassroomVideo from "./ClassroomVideo";
import CurriculumsList from "./CurriculumsList";

export interface LessonType extends Lesson {
  lessonProgress: LessonProgress[];
  section: Curriculum;
}

interface AskTutorMessageType extends AskTutorMessages {
  attachment: File | null;
}

type MyImageType = ImageType | null;

interface CourseType extends Course {
  image: MyImageType;
  curriculum: (Curriculum & {
    lessons: LessonType[];
  })[];
}

interface EnrollmentType extends Enrollment {
  course: CourseType;
  lessonProgress: LessonProgress[];
}

interface AsktutorType extends AskTutor {
  user: User & { image: MyImageType };
  tutor: Tutor & { image: MyImageType };
  messages: AskTutorMessageType[] | undefined;
}

interface ClassroomType extends ClassRoom {
  enrollment: EnrollmentType;
  askTutor: AsktutorType | null;
}

interface Props {
  classroom: ClassroomType;
}

const ClassroomContent = ({ classroom }: Props) => {
  const lessons = classroom.enrollment.course.curriculum.flatMap((curr) =>
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
  }, [classroom.enrollment.course.curriculum]);

  const totalLessonsCount = classroom.enrollment.course.curriculum.reduce(
    (acc, curr) => acc + curr.lessons.length,
    0
  );
  const completedLessonsCount = classroom.enrollment.lessonProgress.length;
  const isLastLesson = totalLessonsCount - completedLessonsCount === 1;

  return (
    <div className="grid grid-cols-12 gap-3 w-full">
      <div className="col-span-12 md:col-span-5 lg:col-span-6 xl:col-span-4 space-y-5">
        <Badge
          className="w-full p-2 gap-3 text-right justify-start text-sm hover:bg-blue-50"
          variant={"blue"}
        >
          <Image
            alt="Pic"
            src={classroom.enrollment.course.image?.url || placeHolder}
            width={65}
            height={65}
            className="rounded-md object-cover aspect-[3/2]"
          />
          <div className="flex flex-col">
            <span>{classroom.enrollment.course.title}</span>
            <span className="text-xs text-muted-foreground font-medium">
              {classroom.askTutor?.tutor.displayName}
            </span>
          </div>
        </Badge>

        <div className="flex items-center gap-2">
          <span className="text-nowrap text-sm text-muted-foreground">
            پیشرفت:
          </span>
          <Progress value={classroom.enrollment.progress} />
          <span className="text-nowrap text-sm text-muted-foreground">
            {classroom.enrollment.progress.toFixed()} %
          </span>
        </div>

        <div className="hidden lg:block">
          <CurriculumsList
            curriculums={classroom.enrollment.course.curriculum}
            currentLesson={currentLesson}
            onLessonSelect={setCurrentLesson}
          />
        </div>
      </div>

      <div className="col-span-12 md:col-span-7 lg:col-span-6 xl:col-span-8 space-y-8 xl:pr-5">
        <ClassroomVideo
          isLastLesson={isLastLesson}
          courseTitle={classroom.enrollment.course.title}
          currentLesson={currentLesson}
        />

        <div className="lg:hidden">
          <CurriculumsList
            curriculums={classroom.enrollment.course.curriculum}
            currentLesson={currentLesson}
            onLessonSelect={setCurrentLesson}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <AskTutorForm
            status={classroom.askTutor?.status!}
            classRoomId={classroom.id}
            askTutorId={classroom.askTutorId}
            courseId={classroom.enrollment?.courseId!}
            tutorId={classroom.enrollment.course.tutorId!}
            userId={classroom.enrollment?.userId!}
          />
          <div className="max-h-[600px] overflow-y-auto">
            <AskTutorChat
              messages={classroom.askTutor?.messages}
              user={classroom.askTutor?.user}
              tutor={classroom.askTutor?.tutor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomContent;
