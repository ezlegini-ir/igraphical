import CourseForm from "@/components/forms/dashboard/course/CourseForm/CourseForm";
import { getAllTutors } from "@/data/tutor";
import { database } from "@igraph/database";

const page = async () => {
  const tutors = await getAllTutors();
  const categories = await database.courseCategory.findMany();

  return (
    <div className="space-y-3">
      <h3>Create a Course</h3>

      <CourseForm type="NEW" tutors={tutors} categories={categories} />
    </div>
  );
};

export default page;
