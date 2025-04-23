import { useState } from "react";
import { createLessonProgress } from "@/actions/classroom";
import { Button } from "@igraph/ui/components/ui/button";
import Loader from "@igraph/ui/components/Loader";
import { useLoading } from "@igraph/utils";
import { Check, Download, File } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { LessonType } from "./ClassroomContent";
import dynamic from "next/dynamic";

const Video = dynamic(() => import("@igraph/ui/components/Video"), {
  ssr: false,
});

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
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);

  const handleNextLesson = async () => {
    setLoading(true);
    const classroomId = String(params.id);

    const res = await createLessonProgress(currentLesson.id, classroomId);

    if (res.error) {
      toast.error(res.error);
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

  if (!currentLesson) return <div>No Lesson Provided</div>;

  return (
    <div className="space-y-6 px-3 mb-3">
      <div className="fixed top-0 right-0 z-10">
        {showConfetti && (
          <Confetti
            gravity={0.2}
            width={width}
            height={height}
            recycle={confettiRecycle}
          />
        )}
      </div>
      <div className="space-y-3">
        <p className="font-semibold">{courseTitle}</p>
        {currentLesson?.type === "VIDEO" ? (
          <Video key={currentLesson.url} src={currentLesson.url} />
        ) : currentLesson?.type === "ASSET" ? (
          <div>
            <Link
              href={currentLesson.url}
              className="aspect-video bg-orange-400 text-primary-foreground flex flex-col gap-3 justify-center items-center rounded-sm group"
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
            {currentLesson.title}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomVideo;
