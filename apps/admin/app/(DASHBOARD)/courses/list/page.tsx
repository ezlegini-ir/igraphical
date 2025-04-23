import Filter from "@igraph/ui/components/Filter";
import NewButton from "@igraph/ui/components/NewButton";
import Search from "@igraph/ui/components/Search";
import { Button } from "@igraph/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@igraph/ui/components/ui/dropdown-menu";
import { pagination } from "@igraph/utils";
import { database } from "@igraph/database";
import { SlidersHorizontal } from "lucide-react";
import CoursesList from "./CoursesList";
import { Prisma, Status } from "@igraph/database";

interface Props {
  searchParams: Promise<{
    page: string;
    tutor: string;
    isFree: string;
    status: string;
    search: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, tutor, search, isFree, status } = await searchParams;

  const where: Prisma.CourseWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { title: { contains: search } },
              {
                tutor: {
                  OR: [
                    { name: { contains: search } },
                    { displayName: { contains: search } },
                  ],
                },
              },
            ],
          }
        : {},

      tutor ? { tutor: { slug: tutor } } : {},
      isFree ? (isFree === "yes" ? { price: 0 } : { price: { not: 0 } }) : {},
      status ? { status: status as Status } : {},
    ],
  };

  const pageSize = 12;

  const { skip, take } = pagination(page, pageSize);

  const courses = await database.course.findMany({
    where,
    include: {
      review: true,
      image: true,
      tutor: {
        include: { image: true },
      },
      category: true,
      curriculum: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },

    take,
    skip,
  });

  const totalCourses = await database.course.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Courses</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <div className="hidden  gap-2  md:flex">
            <Filters />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden" asChild>
                <Button size={"sm"} variant="outline">
                  <SlidersHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <div className="space-y-3">
                  <Filters />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <NewButton href="/courses/new" title="New Course" />
          </div>
        </div>
      </div>

      <CoursesList
        courses={courses}
        totalCourses={totalCourses}
        pageSize={pageSize}
      />
    </div>
  );
};

const Filters = async () => {
  type Filter = { label: string; value: string }[];

  const tutors: Filter = (await database.tutor.findMany()).map((item) => ({
    label: item.name,
    value: item.slug,
  }));

  return (
    <>
      <Filter placeholder="All Tutors" name="tutor" options={tutors} />

      <Filter
        name="status"
        placeholder="All Statuses"
        options={[
          { label: "Published", value: "PUBLISHED" },
          { label: "Drafts", value: "DRAFT" },
        ]}
      />
      <Filter
        name="isFree"
        placeholder="All Prices"
        options={[
          { label: "Free", value: "yes" },
          { label: "No Free", value: "no" },
        ]}
      />
      {/* {<Filter
        name="student"
        placeholder="All Students"
        options={[
          { label: "Most Students", value: "most" },
          { label: "Lowest Students", value: "lowest" },
        ]}
      />
      <Filter
        name="rate"
        placeholder="All Rates"
        options={[
          { label: "Highest", value: "high" },
          { label: "Lowest", value: "low" },
        ]}
      />} */}
    </>
  );
};

export default page;
