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

  const runningCourses = runningEnrollment.map((item) => item.course);
  return (
    <div className="grid gap-3 grid-rows-2">
      <div>
        <RunningCourses runningCourses={runningCourses} />
      </div>

      <div>
        <CompletedCourses />
      </div>
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "دوره‌های من",
};
