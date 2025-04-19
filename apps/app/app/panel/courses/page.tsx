import { database } from "@igraph/database";
import CompletedCourses from "./components/CompletedCourses";
import { getSessionUser } from "@/data/user";
import RunningCourses from "../components/RunningCourses";
import { Metadata } from "next";

const page = async () => {
  const userId = (await getSessionUser())?.id;

  const runningEnrollment = await database.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    where: {
      userId,
      completedAt: null,
    },
    include: {
      course: {
        include: {
          enrollment: {
            where: { userId },
            include: {
              classroom: true,
            },
          },
          image: true,
          tutor: true,
          curriculum: {
            include: {
              lessons: {
                include: {
                  lessonProgress: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const runningCourses = runningEnrollment.map((e) => e.course);

  return (
    <div className="space-y-3">
      <RunningCourses runningCourses={runningCourses} />

      <CompletedCourses />
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "دوره‌های من",
};
