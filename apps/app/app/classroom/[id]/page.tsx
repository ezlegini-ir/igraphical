import AskTutorForm from "@/components/forms/AskTutorForm";
import { database } from "@igraph/database";
import { ScrollArea } from "@igraph/ui/components/ui/scroll-area";
import { notFound, redirect } from "next/navigation";
import AskTutorChat from "./components/AskTutorChat";
import ClassroomContent from "./components/ClassroomContent";
import { cache } from "react";
import { Metadata } from "next";
import { getSessionUser } from "@/data/user";

interface Props {
  params: Promise<{ id: string }>;
}
const getClassroom = cache(async (id: string) => {
  return await database.classRoom.findUnique({
    where: { id },
    include: {
      askTutor: {
        include: {
          user: {
            include: { image: true },
          },
          tutor: {
            include: { image: true },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            include: {
              attachment: true,
            },
          },
        },
      },
      enrollment: {
        include: {
          course: {
            include: {
              curriculum: {
                include: {
                  lessons: {
                    include: {
                      lessonProgress: true,
                      section: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
});

const page = async ({ params }: Props) => {
  const userId = (await getSessionUser())?.id;
  if (!userId) return notFound();
  const { id } = await params;

  const classroom = await getClassroom(id);

  if (!classroom) return notFound();

  if (userId !== classroom.userId) return redirect("/panel");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_5fr] xl:grid-cols-[6fr_12fr_6fr] gap-3 ">
      <ClassroomContent course={classroom.enrollment.course} />

      <div className="space-y-3">
        <AskTutorForm
          classRoomId={id}
          status={classroom.askTutor?.status!}
          askTutorId={classroom.askTutorId}
          courseId={classroom.enrollment?.courseId!}
          tutorId={classroom.enrollment.course.tutorId!}
          userId={classroom.enrollment?.userId!}
        />
        <div>
          <ScrollArea dir="rtl" className="h-[500px]">
            <AskTutorChat
              messages={classroom.askTutor?.messages}
              user={classroom.askTutor?.user}
              tutor={classroom.askTutor?.tutor}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default page;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const classroom = await getClassroom(id);
  if (!classroom) return {};

  return {
    title: `${classroom.enrollment.course.title}`,
  };
}
