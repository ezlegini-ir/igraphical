import PageTitle from "@igraph/ui/components/PageTitle";
import QueryCard from "@igraph/ui/components/QueryCard";
import { database, Prisma } from "@igraph/database";
import CourseGrid from "./[slug]/components/CourseGrid";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    category: string;
    tutor: string;
    isFree: "YES" | "NO";
  }>;
}

const Page = async ({ searchParams }: Props) => {
  const { category, isFree, tutor } = await searchParams;

  const where: Prisma.CourseWhereInput = {
    status: "PUBLISHED",
    ...(category ? { category: { is: { url: category } } } : {}),
    ...(isFree === "YES"
      ? { price: 0 }
      : isFree === "NO"
        ? { price: { not: 0 } }
        : {}),
    ...(tutor ? { tutor: { is: { slug: tutor } } } : {}),
  };

  const courses = await database.course.findMany({
    where,
    orderBy: { id: "desc" },
    include: {
      image: true,
      discount: true,
      review: true,
      enrollment: true,
      curriculum: {
        include: {
          lessons: true,
        },
      },
    },
  });

  //* QUERIES -------------------------------

  const cousreCategories = (await database.courseCategory.findMany()).map(
    (item) => ({ label: item.name, value: item.url })
  );

  const tutors = (await database.tutor.findMany()).map((item) => ({
    label: item.displayName,
    value: item.slug,
  }));

  const priceItem = [
    { label: "رایگان", value: "YES" },
    { label: "غیر رایگان", value: "NO" },
  ];

  return (
    <div className="mb-20">
      <PageTitle
        title={"دوره‌های ما"}
        description={"شما می توانید دوره های ما را در این صفحه پیدا کنید."}
      />

      <div className="flex flex-wrap md:flex-nowrap gap-6 ">
        <div className={`${"w-full md:w-5/12 lg:w-3/12"} space-y-3`}>
          <QueryCard
            options={cousreCategories}
            title="دسته بندی ها"
            name="category"
          />
          <QueryCard options={tutors} title="مدرس" name="tutor" />
          <QueryCard options={priceItem} title="قیمت" name="isFree" />
        </div>

        <div className={"w-full md:w-10/12 lg:w-11/12"}>
          <CourseGrid courses={courses} />
        </div>
      </div>
    </div>
  );
};

export default Page;

export const metadata: Metadata = {
  title: "دوره ها",
  description:
    "دسترسی به کامل‌ترین دوره‌های آموزشی آی‌گرافیکال در زمینه طراحی، نرم‌افزارهای گرافیکی، بسته‌بندی، موشن دیزاین و UI/UX. آموزش‌های پروژه‌محور و بروز.",
};
