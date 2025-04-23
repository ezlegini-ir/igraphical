import Avatar from "@igraph/ui/components/Avatar";
import QuickCartCheckoutForm from "@/components/forms/QuickCartCheckoutForm";
import { getSessionUser } from "@/data/user";
import { database } from "@igraph/database";
import { placeHolder } from "@/public";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const course = await database.course.findUnique({
    where: { id: +id },
    include: {
      enrollment: true,
      image: true,
      discount: true,
      tutor: {
        include: { image: true },
      },
    },
  });

  if (!course) return notFound();

  const userId = (await getSessionUser())?.id;

  const wallet = await database.wallet.findFirst({
    where: { userId },
  });

  return (
    <div className="card max-w-sm mx-auto  space-y-6">
      <div className="flex items-center gap-2 card">
        <Image
          alt=""
          src={course?.image?.url || placeHolder}
          width={90}
          height={90}
          className="rounded-sm aspect-video object-cover"
        />

        <div>
          <p className="font-medium">{course?.title}</p>
          <div className="flex gap-1 items-center">
            <Avatar src={course?.tutor?.image?.url} size={20} />
            <span className="font-normal text-xs text-slate-500">
              {course?.tutor?.displayName}
            </span>
          </div>
        </div>
      </div>

      <QuickCartCheckoutForm course={course} wallet={wallet} />
    </div>
  );
};

export default page;
