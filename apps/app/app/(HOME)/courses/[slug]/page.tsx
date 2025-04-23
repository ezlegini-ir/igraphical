import CourseSidebar from "@/app/(HOME)/courses/[slug]/components/CourseSidebar";
import { database } from "@igraph/database";
import BreadCrumb from "@igraph/ui/components/BreadCrumb";
import { extractSummaryFromLexical } from "@igraph/utils";
import { Star } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import CourseContent from "./components/CourseContent";
import CourseTitle from "./components/CourseTitle";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviews: string }>;
}

const getCourse = cache(async (slug: string, reviews?: string) => {
  const decodedSlug = decodeURIComponent(slug);

  return await database.course.findUnique({
    where: { url: decodedSlug },
    include: {
      enrollment: {
        include: {
          classroom: true,
        },
      },
      image: true,
      review: {
        take: +(reviews || 8),
        orderBy: { id: "desc" },
        include: {
          user: {
            include: { image: true },
          },
        },
      },
      curriculum: {
        include: {
          lessons: true,
        },
      },
      discount: true,
      gallery: {
        include: {
          image: true,
        },
      },
      tutor: {
        include: { image: true },
      },
      category: true,
      learn: true,
      prerequisite: true,
    },
  });
});

const page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { reviews } = await searchParams;

  const course = await getCourse(slug, reviews);

  if (!course) return notFound();

  const courseRate =
    course.review.reduce((acc, curr) => acc + curr.rate, 0) /
      course.review.length || 0;

  return (
    <div className="mt-10 space-y-6">
      <BreadCrumb
        steps={[{ label: "دوره‌ها", href: "/courses" }]}
        finalStep={course.title}
      />

      <div className="flex md:hidden items-center justify-between">
        <CourseTitle title={course.title} category={course.category!} />

        <div className="flex gap-2">
          <span className="font-semibold">{courseRate}</span>
          <Star size={20} className="text-orange-400" />
        </div>
      </div>

      <div className="course-page-layout">
        <CourseContent course={course} />

        <CourseSidebar course={course} />
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

  const course = await getCourse(slug);
  if (!course) return {};

  const description = extractSummaryFromLexical(course.description).slice(
    0,
    120
  );

  return {
    title: `${course.title}`,
    description,
    openGraph: {
      title: course.title,
      description,
      images: [
        {
          url: course.image?.url || "/og-cover.png",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
  };
}
