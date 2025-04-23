import CourseRatingForm from "@/components/forms/CourseRatingForm";
import Table from "@igraph/ui/components/Table";
import { Button } from "@igraph/ui/components/ui/button";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { getSessionUser } from "@/data/user";
import { database } from "@igraph/database";
import { placeHolder } from "@/public";
import {
  Certificate,
  ClassRoom,
  Course,
  Enrollment,
  Image as ImageType,
  Tutor,
} from "@igraph/database";
import { Download, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardBox from "../../components/CardBox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@igraph/ui/components/ui/tooltip";
import { getReviewByUserIdAndCourseId } from "@/data/review";
import { redirect } from "next/navigation";
import { loginPageRoute } from "@/middleware";

const CompletedCourses = async () => {
  const user = await getSessionUser();
  if (!user) redirect(loginPageRoute);

  const completedCourses = await database.enrollment.findMany({
    where: { completedAt: { not: null }, userId: user?.id },

    include: {
      classroom: true,
      certificate: true,
      course: {
        include: {
          image: true,
          tutor: true,
        },
      },
    },
  });

  interface EnrollmentType extends Enrollment {
    classroom: ClassRoom;
    certificate: Certificate | null;
    course: Course & { image: ImageType | null; tutor: Tutor | null };
  }

  const renderRows = async (enrollment: EnrollmentType) => {
    const existingReview = await getReviewByUserIdAndCourseId(
      enrollment.userId,
      enrollment.courseId
    );

    const isCertificateAllowedToDownload = !!existingReview;

    return (
      <TableRow>
        <TableCell>
          <Link
            href={`/classroom/${enrollment.classroom?.id}`}
            className="flex gap-2 items-center"
          >
            <Image
              alt=""
              src={enrollment.course.image?.url || placeHolder}
              width={70}
              height={70}
              className="object-cover rounded-sm"
            />
            {enrollment.course.title}
          </Link>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Link href={`/tutors/${enrollment.course.tutor?.slug}`}>
            {enrollment.course.tutor?.displayName}
          </Link>
        </TableCell>
        <TableCell>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={
              isCertificateAllowedToDownload
                ? enrollment.certificate?.url
                : undefined
            }
          >
            <Button
              variant="link"
              size="icon"
              disabled={!isCertificateAllowedToDownload}
              style={
                isCertificateAllowedToDownload
                  ? undefined
                  : { pointerEvents: "none" }
              }
            >
              <div className="flex flex-col items-center gap-1">
                <Download className="scale-110" />
                {!isCertificateAllowedToDownload && (
                  <span className="text-xs text-destructive opacity-100">
                    ثبت امتیاز برای دانلود مدرک الزامی است.
                  </span>
                )}
              </div>
            </Button>
          </a>
        </TableCell>
        <TableCell>
          <div className="flex justify-end">
            {existingReview ? (
              <TooltipProvider delayDuration={25}>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: existingReview.rate }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={15}
                            fill="#facc15"
                            className="text-yellow-400"
                          />
                        )
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{existingReview.content}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <CourseRatingForm
                courseId={enrollment.courseId}
                userId={user?.id}
              />
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <CardBox title="دوره های تکمیل شده">
      <Table
        columns={columns}
        data={completedCourses}
        renderRows={renderRows}
        noDataMessage="تاکنون دوره تکمیل شده ای نداشته اید."
      />
    </CardBox>
  );
};

const columns = [
  { label: "دوره", className: "text-right" },
  { label: "مدرس", className: "hidden md:table-cell text-right" },
  { label: "مدرک", className: "text-right" },
  { label: "امتیاز شما", className: "text-left" },
];

export default CompletedCourses;
