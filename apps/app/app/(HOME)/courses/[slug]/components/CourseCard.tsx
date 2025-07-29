import Price from "@igraph/ui/components/Price";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@igraph/ui/components/ui/card";
import { placeHolder } from "@/public";
import {
  Course,
  Curriculum,
  Discount,
  Enrollment,
  Image as ImageType,
  Lesson,
  Review,
} from "@igraph/database";
import { ChevronLeft, SquareMenu, Star, TvMinimalPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { calculateCourseRate } from "@igraph/utils";

export interface CourseType extends Course {
  image: ImageType | null;
  discount: Discount | null;
  review: Review[];
  enrollment: Enrollment[];
  curriculum: (Curriculum & { lessons: Lesson[] })[];
}
interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  return (
    <Card className="overflow-hidden group shadow-none hover:shadow-md">
      <Link href={`/courses/${course.url}`}>
        <CardHeader className="p-0 mb-3">
          <Image
            alt=""
            src={course.image?.url || placeHolder}
            width={500}
            height={500}
            className="w-full aspect-[3/2] object-cover"
          />
        </CardHeader>

        <CardContent className="px-3 space-y-5">
          <div className="bg-slate-100 py-1.5 px-2.5 rounded-sm flex justify-between items-center text-xs font-medium text-slate-500">
            <p className="flex items-center gap-1 tracking-wider">
              <SquareMenu size={15} />
              {course.curriculum.length} فصل
            </p>
            <p className="flex items-center gap-1 tracking-wider">
              {course.curriculum.reduce(
                (acc, curr) => acc + curr.lessons.length,
                0
              )}{" "}
              درس
              <TvMinimalPlay size={15} />
            </p>
          </div>
          <CardTitle className="text-base font-medium">
            <span className="flex items-center gap-1 tracking-wider text-slate-500 text-xs">
              <Star size={14} className="text-orange-400" />
              {calculateCourseRate(course.review)}
            </span>
            <span>{course.title}</span>
          </CardTitle>

          <CardDescription className="flex justify-between items-center">
            <Price
              basePrice={course.basePrice}
              price={course.price}
              discount={course.discount}
            />

            <Button
              variant={"secondary"}
              size={"icon"}
              className="h-7 w-7 group-hover:bg-slate-800 group-hover:text-white"
            >
              <ChevronLeft size={20} />
            </Button>
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourseCard;
