import { createLessonProgress } from "@/actions/classroom";
import ConfettiWrapper from "@igraph/ui/components/ConfettiWrapper";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import { useLoading } from "@igraph/utils";
import { Check, Download, File } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LessonType } from "./ClassroomContent";

//! REPLACE AFTER WAR
// const Video = dynamic(() => import("@igraph/ui/components/Video"), {
//   ssr: false,
// });

interface Props {
  currentLesson: LessonType;
  courseTitle: string;
  isLastLesson: boolean;
}

const ClassroomVideo = ({
  currentLesson,
  courseTitle,
  isLastLesson,
}: Props) => {
  const params = useParams();
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);

  const handleNextLesson = async () => {
    setLoading(true);
    const classroomId = String(params.id);

    const res = await createLessonProgress(currentLesson.id, classroomId);

    if (res.error) {
      toast.error("خطا! لطفا مجدد تلاش کنید.");
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);

      if (res.isLastLesson) {
        setShowConfetti(true);
        setTimeout(() => {
          setConfettiRecycle(false);
          setTimeout(() => {
            setShowConfetti(false);
            router.refresh();
          }, 5000);
        }, 5000);
      }

      router.refresh();
    }
  };

  const completed = currentLesson?.lessonProgress.length > 0;

  if (!currentLesson) return <div>No Lessons Provided</div>;

  return (
    <div>
      <div className="fixed top-0 right-0 z-10">
        {showConfetti && (
          <ConfettiWrapper show={showConfetti} recycle={confettiRecycle} />
        )}
      </div>
      <div className="space-y-3">
        {currentLesson?.type === "VIDEO" ? (
          // <Video key={currentLesson.url} src={currentLesson.url} />
          <video
            src={currentLesson.url}
            key={currentLesson.url}
            autoPlay
            controls
            className="rounded-sm"
          />
        ) : currentLesson?.type === "ASSET" ? (
          <div>
            <Link
              href={currentLesson.url}
              className="aspect-video bg-orange-400 text-primary-foreground flex flex-col gap-3 justify-center items-center rounded-sm group"
              target="_blank"
            >
              <Download size={60} />
              <span className="text-sm">{currentLesson.title}</span>
            </Link>
          </div>
        ) : (
          <div>
            <Link
              href={currentLesson.url}
              className="aspect-video bg-slate-400 flex flex-col gap-3 justify-center items-center rounded-sm group"
              target="_blank"
            >
              <File className="text-gray-500" size={60} />
              <span className="text-sm text-gray-500">
                {currentLesson.title}
              </span>
            </Link>
          </div>
        )}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500">
            جلسه: {currentLesson.title}
          </p>
          <div className="flex gap-2">
            <Button
              disabled={loading || completed}
              variant={completed ? "lightGreen" : "lightBlue"}
              onClick={handleNextLesson}
            >
              <Loader loading={loading} />
              {completed ? (
                <span className="flex items-center gap-1">
                  <Check />
                  تکمیل شده
                </span>
              ) : isLastLesson ? (
                "اتمام دوره و صدور مدرک"
              ) : (
                "تکمیل و جلسه بعد"
              )}
            </Button>

            {/* <a target="_blank" download="ss.mp4" href={currentLesson.url}>
              <Button size={"icon"} variant={"outline"}>
                <Download />
              </Button>
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomVideo;
