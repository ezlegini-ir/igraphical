import { Button } from "@igraph/ui/components/ui/button";
import React from "react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@igraph/ui/components/ui/tabs";
import CourseCard from "../courses/[slug]/components/CourseCard";
import { database } from "@igraph/database";

const LastCourses = async () => {
  const courses = await database.course.findMany({
    where: { status: "PUBLISHED" },
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

  const courseCategories = await database.courseCategory.findMany();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div>
          <h2 id="courses">آخرین دوره‌های آی‌گرافیکال</h2>
          <p className="text-sm text-gray-500">
            دوره مدنظر خود را در دسته بندی مناسب پیدا کنید
          </p>
        </div>

        <Link href={"/courses"}>
          <Button className="border-primary/40 border" variant={"lightBlue"}>
            همه دوره‌ها
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-6" dir="rtl">
        <TabsList className="gap-2 bg-transparent flex-wrap h-full">
          <TabsTrigger
            className="rounded-full px-5 data-[state=active]:bg-primary data-[state=active]:text-white"
            value="all"
          >
            همه دوره‌ها
          </TabsTrigger>

          {courseCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              className="rounded-full px-5"
              value={category.url}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        {courseCategories.map((category) => (
          <TabsContent key={category.id} value={category.url}>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {courses
                .filter((course) => course.categoryId === category.id)
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LastCourses;
