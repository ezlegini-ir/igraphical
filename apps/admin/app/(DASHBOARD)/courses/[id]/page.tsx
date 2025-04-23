import CourseForm from "@/components/forms/dashboard/course/CourseForm/CourseForm";
import { getCourseById } from "@/data/course";
import { getAllTutors } from "@/data/tutor";
import { database } from "@igraph/database";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  const categories = await database.courseCategory.findMany();

  const course = await getCourseById(id);
  if (!course) return notFound();

  const tutors = await getAllTutors();

  return (
    <div className="space-y-3">
      <h3>Update Course</h3>

      <CourseForm
        type="UPDATE"
        course={course}
        tutors={tutors}
        categories={categories}
      />
    </div>
  );
};

export default page;
