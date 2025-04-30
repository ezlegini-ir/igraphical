import CashBackCard from "@igraph/ui/components/CashBackCard";
import Price from "@igraph/ui/components/Price";
import TizerVideo from "@igraph/ui/components/TizerVideo";
import { Button } from "@igraph/ui/components/ui/button";
import { Card, CardContent } from "@igraph/ui/components/ui/card";
import { Separator } from "@igraph/ui/components/ui/separator";
import { getSessionUser } from "@/data/user";
import { formatDuration } from "@igraph/utils";
import {
  Headset,
  LockKeyholeOpen,
  LucideProps,
  Send,
  SquareMenu,
  Star,
  TvMinimalPlay,
} from "lucide-react";
import Link from "next/link";
import { CourseType } from "./CourseContent";
import CourseIncludes from "./CourseIncludes";
import CourseRegisterButton from "./CourseRegisterButton";
import { database } from "@igraph/database";
import { getEnrollmentByUserIdAndCourseId } from "@/data/enrollment";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface Props {
  course: CourseType;
}

const CourseSidebar = async ({ course }: Props) => {
  const userId = (await getSessionUser())?.id;
  const enrollment = await getEnrollmentByUserIdAndCourseId(
    userId || 0,
    course.id
  );

  const isUserEnrolled = !!enrollment;
  const classroomId = enrollment?.classroom?.id;

  const duration = formatDuration(course.duration);
  const seasons = course.curriculum.length;
  const lessons = course.curriculum.reduce(
    (acc, curr) => acc + curr.lessons.length,
    0
  );

  const courseIncludes = [
    {
      label: `بیش از ${duration} ویدیو آموزشی`,
      icon: TvMinimalPlay,
    },
    { label: `${seasons} فصل - ${lessons} جلسه `, icon: SquareMenu },
    { label: "مدرک شرکت در دوره", icon: Star },
    { label: "پشتیبانی رایگان و نامحدود ", icon: Headset },
    { label: "ارتباط مستقیم با مدرس", icon: Send },
    { label: "دسترسی همیشگی، بدون محدودیت", icon: LockKeyholeOpen },
  ];

  const isInCart = !userId
    ? false
    : Boolean(
        await database.cartItem.findUnique({
          where: { courseId: course.id, cart: { userId } },
        })
      );

  return (
    <div className="order-first md:order-last md:sticky top-16 self-start">
      <Card className="p-1 pb-3">
        <CardContent className="p-1 space-y-4">
          {course.tizerUrl && (
            <div className="rounded-sm overflow-hidden">
              <TizerVideo url={course.tizerUrl} />
            </div>
          )}

          <div className="px-4 space-y-5">
            <CourseIncludes
              courseIncludes={
                courseIncludes as {
                  label: string;
                  icon: ForwardRefExoticComponent<
                    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
                  >;
                }[]
              }
            />

            <Separator />

            {isUserEnrolled && (
              <div>
                <Link href={`/classroom/${classroomId}`}>
                  <Button variant={"lightBlue"} className="w-full">
                    <TvMinimalPlay size={22} />
                    ورود به کلاس درس
                  </Button>
                </Link>
              </div>
            )}

            {!isUserEnrolled && (
              <>
                <div className="flex justify-between items-center">
                  <Price
                    basePrice={course.basePrice}
                    discount={course.discount}
                    price={course.price}
                  />
                </div>
                <CashBackCard price={course.price} />
              </>
            )}

            <CourseRegisterButton
              classroomId={classroomId}
              isUserEnrolled={isUserEnrolled}
              basePrice={course.basePrice}
              discount={course.discount}
              price={course.price}
              courseId={course.id}
              isFree={course.price === 0}
              isInCart={isInCart}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSidebar;
