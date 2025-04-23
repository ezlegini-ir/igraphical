import CardBox from "@/app/panel/components/CardBox";
import BreadCrumb from "@igraph/ui/components/BreadCrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@igraph/ui/components/ui/accordion";
import { Curriculum, Lesson } from "@igraph/database";
import { Download, File, Video } from "lucide-react";
import { LessonType } from "./ClassroomContent";
import { useEffect, useState } from "react";

interface Props {
  curriculums: (Curriculum & {
    lessons: LessonType[];
  })[];
  onLessonSelect: (lesson: LessonType) => void;
  currentLesson: LessonType;
}

const CurriculumsList = ({
  curriculums,
  onLessonSelect,
  currentLesson,
}: Props) => {
  const [activeSection, setActiveSection] = useState(
    curriculums[0]?.sectionTitle || ""
  );

  useEffect(() => {
    if (currentLesson) {
      const currentCurriculum = curriculums.find((curriculum) =>
        curriculum.lessons.some((lesson) => lesson.id === currentLesson.id)
      );
      if (currentCurriculum) {
        setActiveSection(currentCurriculum.sectionTitle);
      }
    }
  }, [currentLesson, curriculums]);

  function formatSectionDuration(lessons: Lesson[]): string {
    const duration = lessons.reduce(
      (acc, curr) => acc + (curr.duration || 0),
      0
    );
    return duration === 0 ? "" : `${duration}m`;
  }

  return (
    <div>
      <div className="py-3">
        <BreadCrumb
          finalStep="کلاس درس"
          steps={[{ label: "دوره ها", href: "/panel/courses" }]}
        />
      </div>
      <CardBox title="درس‌ها" className="h-min">
        <Accordion
          value={activeSection}
          onValueChange={(val) => setActiveSection(val)}
          type="single"
          collapsible
          className="w-full"
        >
          {curriculums.map((curriculum, index) => (
            <AccordionItem
              className="border px-3 rounded-lg mb-2"
              key={index}
              value={curriculum.sectionTitle}
            >
              <AccordionTrigger className="font-semibold flex items-center justify-between text-xs">
                {index + 1}. {curriculum.sectionTitle}
                <div className="flex gap-2 mr-auto ml-4">
                  <span className="text-xs font-medium space-x-3 text-slate-500 flex gap-1 items-center">
                    {formatSectionDuration(curriculum.lessons)}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <ul className="text-slate-500 border-t pt-2">
                  {curriculum.lessons.map((lesson, idx) => (
                    <li
                      key={idx}
                      className={`flex justify-between items-center text-[13px] cursor-pointer hover:bg-slate-50 py-2 px-1.5 rounded-sm ${
                        currentLesson.id === lesson.id && "bg-primary/10"
                      }`}
                      onClick={() => onLessonSelect(lesson)}
                    >
                      <div className="flex items-center gap-2">
                        {lesson.type === "VIDEO" ? (
                          <div className="bg-primary p-1.5 rounded-full border-2 border-blue-200">
                            <Video size={14} className="text-white" />
                          </div>
                        ) : lesson.type === "ASSET" ? (
                          <div className="bg-orange-400 p-1.5 rounded-full border-2 border-orange-200">
                            <Download size={14} className="text-white" />
                          </div>
                        ) : (
                          <div className="bg-slate-100 p-1.5 rounded-full border-2 border-slate-100">
                            <File size={14} />
                          </div>
                        )}
                        {lesson.type === "VIDEO" && <span>{idx + 1}.</span>}
                        <span>{lesson.title}</span>
                      </div>
                      <span dir="ltr" className="text-xs text-gray-400">
                        {lesson.duration && lesson.duration > 0
                          ? `${lesson.duration}m`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardBox>
    </div>
  );
};

export default CurriculumsList;
