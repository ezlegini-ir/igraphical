import Avatar from "@igraph/ui/components/Avatar";
import Pagination from "@igraph/ui/components/Pagination";
import Search from "@igraph/ui/components/Search";
import { Button } from "@igraph/ui/components/ui/button";
import { Separator } from "@igraph/ui/components/ui/separator";
import { pagination } from "@igraph/utils";
import { database } from "@igraph/database";
import { placeHolder } from "@/public";
import {
  AskTutor,
  AskTutorMessages,
  Course,
  Image as ImageType,
  Prisma,
  Tutor,
} from "@igraph/database";
import Image from "next/image";
import Link from "next/link";

interface CourseType extends Course {
  image: ImageType | null;
  tutor: (Tutor & { image: ImageType | null }) | null;
  askTutor: (AskTutor & {
    messages: AskTutorMessages[] | null;
    _count: { messages: number };
  })[];
}

interface PageProps {
  searchParams: Promise<{ page: string; search: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const { page, search } = await searchParams;

  const where: Prisma.CourseWhereInput = {
    title: { contains: search },
  };

  const { skip, take } = pagination(page);
  const courses = await database.course.findMany({
    where,
    include: {
      image: true,
      tutor: {
        include: { image: true },
      },
      askTutor: {
        include: { messages: true, _count: { select: { messages: true } } },
      },
    },

    skip,
    take,
  });
  const totalCourses = await database.course.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Questions and Answers</h3>
        <Search placeholder="Search Courses" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} index={index} />
        ))}
      </div>
      <Pagination pageSize={16} totalItems={totalCourses} />
    </div>
  );
};

export default page;

interface Props {
  course: CourseType;
  index: number;
}
const CourseCard = ({ course, index }: Props) => {
  return (
    <div className="card">
      <Image
        alt=""
        src={course.image?.url || placeHolder}
        width={400}
        height={400}
        className="object-cover aspect-video rounded-sm w-full"
      />
      <div className="text-right font-semibold">{course.title}</div>

      <ul>
        <li className="flex justify-between py-2 text-gray-500 text-sm">
          <span>Tutor</span>
          <span className="flex items-center gap-1">
            <Avatar src={course.tutor?.image?.url} size={20} />
            <span>{course?.tutor?.name}</span>
          </span>
        </li>

        <Separator />
        <li className="flex justify-between py-2 text-gray-500 text-sm">
          <span>Chats</span>
          <span>{course.askTutor.length.toLocaleString("en-US")}</span>
        </li>

        <Separator />
        <li className="flex justify-between py-2 text-gray-500 text-sm">
          <span>Messages</span>
          <span>
            {course.askTutor
              .reduce((acc, curr) => acc + (curr.messages?.length || 0), 0)
              .toLocaleString("en-US")}
          </span>
        </li>
      </ul>

      <Link href={`/qa/courses/${course.id}`}>
        <Button variant={"outline"} className="w-full">
          View Chats
        </Button>
      </Link>
    </div>
  );
};
