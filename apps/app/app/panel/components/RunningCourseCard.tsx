import { Button } from "@igraph/ui/components/ui/button";
import { Progress } from "@igraph/ui/components/ui/progress";
import { placeHolder } from "@/public";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  progress: number;
  title: string;
  tutor: string;
  imageUrl?: string;
  classroomUrl: string;
  remainingLessons: number;
}

const RunningCourseCard = ({
  progress,
  remainingLessons,
  title,
  tutor,
  imageUrl,
  classroomUrl,
}: Props) => {
  return (
    <div className="card py-3">
      <div className="space-y-5">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Image
              alt=""
              src={imageUrl || placeHolder}
              width={85}
              height={85}
              className="rounded-md object-cover aspect-video"
            />

            <Link href={classroomUrl}>
              <p className="font-medium">{title}</p>
              <p className="text-xs text-gray-500">{tutor}</p>
            </Link>
          </div>

          <div className="hidden md:flex gap-2 h-min items-center">
            <Link href={classroomUrl}>
              <Button variant={"secondary"} size={"sm"} className="h-7">
                کلاس درس <MoveLeft />
              </Button>
            </Link>
          </div>
        </div>

        {progress !== 100 && (
          <div className="space-y-1.5">
            <Progress value={progress} />
            <div
              dir="ltr"
              className="text-xs text-gray-500 flex justify-between"
            >
              <div className="space-x-2">
                <span>%{progress?.toFixed()}</span>
                {/* <span>-</span> */}
                {/* <span dir="rtl">{completedLessons} جلسه</span> */}
              </div>

              <div dir="rtl">{remainingLessons} جلسه مانده</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunningCourseCard;
