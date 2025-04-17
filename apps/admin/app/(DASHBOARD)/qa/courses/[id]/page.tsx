import Avatar from "@igraph/ui/components/Avatar";
import Pagination from "@igraph/ui/components/Pagination";
import Search from "@igraph/ui/components/Search";
import { Button } from "@igraph/ui/components/ui/button";
import { getCourseById } from "@/data/course";
import { pagination } from "@igraph/utils";
import { database } from "@igraph/database";
import {
  AskTutor,
  AskTutorMessages,
  Image as ImageType,
  Prisma,
  Tutor,
  User,
} from "@igraph/database";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search: string; page: string }>;
}
const page = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { search, page } = await searchParams;

  const where: Prisma.AskTutorWhereInput = {
    courseId: +id,
    user: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { phone: { contains: search } },
            { nationalId: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
  };

  const { skip, take } = pagination(page);
  const course = await getCourseById(id);
  const qa = await database.askTutor.findMany({
    where,
    include: {
      user: {
        include: {
          image: true,
        },
      },
      tutor: {
        include: {
          image: true,
        },
      },
      messages: {
        orderBy: { id: "desc" },
      },
    },

    skip,
    take,
  });
  const totalQa = await database.askTutor.count({ where });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3>{course?.title}</h3>

        <Search placeholder="Search Users..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {qa.map((item, index) => (
          <QaCard key={index} qa={item} />
        ))}
      </div>

      <Pagination pageSize={16} totalItems={totalQa} />
    </div>
  );
};

export default page;

export interface QaType extends AskTutor {
  tutor: Tutor & { image: ImageType | null };
  user: User & { image: ImageType | null };
  messages: AskTutorMessages[] | null;
}

interface QaProps {
  qa: QaType | null;
}

const QaCard = ({ qa }: QaProps) => {
  return (
    <div className="card">
      <div className="flex gap-3 items-center justify-between">
        <div className="border-4 rounded-full">
          <Avatar src={qa?.tutor.image?.url} size={100} />
        </div>

        <div className="w-full border" />

        <div className="border-4 rounded-full">
          <Avatar src={qa?.user.image?.url} size={100} />
        </div>
      </div>

      <div className="flex justify-between text-gray-500 text-sm">
        <span>{qa?.tutor.displayName}</span>
        <span>{qa?.user.fullName}</span>
      </div>

      <div
        dir="rtl"
        className="p-2 px-3 bg-slate-50 border rounded-md text-sm w-full text-gray-500"
      >
        {qa?.messages?.[0]?.message.slice(0, 50)}...
      </div>

      <div>
        <Link href={`/qa/courses/${qa?.courseId}/message/${qa?.id}`}>
          <Button variant={"outline"} className="w-full">
            View Messages
          </Button>
        </Link>
      </div>
    </div>
  );
};
