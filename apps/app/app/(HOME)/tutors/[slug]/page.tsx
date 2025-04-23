import BreadCrumb from "@igraph/ui/components/BreadCrumb";
import { Badge } from "@igraph/ui/components/ui/badge";
import { database } from "@igraph/database";
import { tutorPlaceholder } from "@/public";
import { Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import CourseCard from "../../courses/[slug]/components/CourseCard";
import { cache } from "react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const getTutor = cache(async (slug: string) => {
  return await database.tutor.findUnique({
    where: { slug },
    include: {
      image: true,
      courses: {
        include: {
          discount: true,
          image: true,
          enrollment: true,
          review: true,
          curriculum: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  });
});

const page = async ({ params }: Props) => {
  const { slug } = await params;
  const tutor = await getTutor(slug);

  if (!tutor) return notFound();

  const courseCount = tutor.courses.length;
  const courseDuration = tutor.courses.reduce(
    (acc, curr) => acc + (curr?.duration || 0),
    0
  );
  const studentCount = tutor.courses.reduce(
    (acc, curr) => acc + (curr?.enrollment.length || 0),
    0
  );

  const tutorRating =
    tutor.courses.reduce((acc, course) => {
      return (
        acc +
        (course?.review?.reduce((acc, curr) => acc + (curr.rate || 0), 0) || 0)
      );
    }, 0) /
    tutor.courses.reduce((acc, curr) => acc + (curr.review.length || 0), 0);

  const tutorRecords = [
    { title: "دوره", value: courseCount },
    { title: "دقیقه آموزش", value: courseDuration },
    { title: "دانش‌آموز", value: studentCount },
  ];

  return (
    <div className="mt-10 space-y-3">
      <BreadCrumb
        steps={[{ label: "مدرسین", href: "/tutors" }]}
        finalStep={tutor?.displayName}
      />

      <div className="card sm:px-12 py-6 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:justify-between">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-right md:gap-6">
            <Image
              alt=""
              src={tutor.image?.url || tutorPlaceholder}
              width={225}
              height={225}
            />

            <div className="flex flex-col py-10 gap-3">
              <h1 className="text-2xl">{tutor.displayName}</h1>

              <div className="flex gap-2 items-stretch">
                <div className="w-[2px] bg-slate-300" />
                <pre className="text-gray-500 text-sm">{tutor.titles}</pre>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="card">
              <div className="flex gap-10">
                {tutorRecords.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Badge
                      variant={"outline"}
                      className="rounded-sm text-sm pt-1 tracking-wider"
                    >
                      {item.value.toLocaleString("en-US")}
                    </Badge>
                    <p className="text-gray-500">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-1 justify-between text-sm">
              امتیاز این مدرس:
              <span className="flex gap-1 items-center font-semibold">
                {tutorRating.toFixed(1)}{" "}
                <Star fill="#facc15" className="text-yellow-400" size={16} />
              </span>
            </div>
          </div>
        </div>

        <div className="card">{tutor.bio}</div>

        <div className="space-y-3">
          <div className="bg-primary text-white text-center p-2 rounded-sm">
            دوره های این مدرس
          </div>
          <div
            className={
              "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }
          >
            {tutor.courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const tutor = await getTutor(slug);
  if (!tutor) return {};

  return {
    title: `${tutor.displayName} - مدرس آی‌گرافیکال`,
    description: tutor.bio?.slice(0, 120) || `آشنایی با ${tutor.displayName}،`,
  };
}
