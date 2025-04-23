import { database } from "@igraph/database";
import CourseCard from "./CourseCard";

const RelatedCourses = async ({
  categoryName,
  currentCourseId,
}: {
  categoryName: string;
  currentCourseId: number;
}) => {
  const courses = await database.course.findMany({
    where: {
      id: { not: currentCourseId },
      status: "PUBLISHED",
      category: {
        name: categoryName,
      },
    },
    take: 3,
    include: {
      image: true,
      review: true,
      discount: true,
      enrollment: true,
      curriculum: {
        include: {
          lessons: true,
        },
      },
    },
  });

  if (!courses.length) return;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">دوره های مرتبط:</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;
