import PageTitle from "@igraph/ui/components/PageTitle";
import TutorCard from "./components/TutorCard";
import { database } from "@igraph/database";
import { Metadata } from "next";

const page = async () => {
  const tutors = await database.tutor.findMany({
    include: {
      image: true,
      courses: {
        include: {
          enrollment: true,
        },
      },
    },
  });

  return (
    <div className="text-center">
      <PageTitle
        title={"مدرسین آی‌گرافیکال"}
        description={"در این صفحه می توانید با مدرسین آی‌گرافیکال آشنا شوید."}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-7">
        {tutors.map((tutor, index) => (
          <TutorCard key={index} tutor={tutor} />
        ))}
      </div>
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "مدرسین",
  description:
    "با مدرسین حرفه‌ای آی‌گرافیکال آشنا شوید. متخصصین با تجربه در حوزه طراحی گرافیک، موشن گرافیک، بسته‌بندی، برنامه‌نویسی و آموزش نرم‌افزارهای کاربردی.",
};
