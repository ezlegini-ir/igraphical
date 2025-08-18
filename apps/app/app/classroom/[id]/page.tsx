import { getSessionUser } from "@/data/user";
import { database } from "@igraph/database";
import BreadCrumb from "@igraph/ui/components/BreadCrumb";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { OctagonMinus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import ClassroomContent from "./components/ClassroomContent";

interface Props {
  params: Promise<{ id: string }>;
}
const getClassroom = cache(async (id: string) => {
  const userId = (await getSessionUser())?.id;

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
          lessonProgress: true,
          course: {
            include: {
              image: true,
              curriculum: {
                include: {
                  lessons: {
                    include: {
                      lessonProgress: {
                        where: {
                          userId,
                        },
                      },
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
  const user = await getSessionUser();
  if (!user) return notFound();
  const { id } = await params;

  const classroom = await getClassroom(id);

  if (!classroom) return notFound();

  if (user.id !== classroom.userId) return redirect("/panel");

  return (
    <div>
      <div className="space-y-3 max-w-screen-xl mx-auto">
        <BreadCrumb
          finalStep="کلاس درس"
          steps={[{ label: "دوره ها", href: "/panel/courses" }]}
        />
        <ClassroomContent classroom={classroom} />
      </div>

      <Dialog open={!user.nationalId}>
        <DialogTrigger dir="rtl" />

        <DialogContent dir="rtl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center flex flex-col items-center gap-3">
              <OctagonMinus className="text-destructive" size={60} />
              لطفا ابتدا کد ملی خود را ذخیره کنید.
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-center">
              برای صدور مدرک پایان دوره، ثبت کد ملی ضروری است. لطفاً با مراجعه
              به بخش پروفایل، کد ملی خود را وارد و ذخیره کنید.
            </DialogDescription>

            <Link href={"/panel/profile"}>
              <Button className="w-full">پروفایل من</Button>
            </Link>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
