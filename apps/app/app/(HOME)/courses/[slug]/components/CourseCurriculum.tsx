import CurriculumPlay from "@igraph/ui/components/CurriculumPlay";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@igraph/ui/components/ui/accordion";
import { Badge } from "@igraph/ui/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { Curriculum, Lesson } from "@igraph/database";
import { Download, File, Lock, Video } from "lucide-react";

interface CurriculumType extends Curriculum {
  lessons: Lesson[];
}

export interface CurriculumsProps {
  curriculums: CurriculumType[];
}

const CourseCurriculum = ({ curriculums }: CurriculumsProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">محتوای این دوره:</h2>
      <Accordion
        type="single"
        collapsible
        defaultValue={curriculums[0]?.id.toString()}
        className="w-full space-y-3"
      >
        {curriculums.map((curriculum, index) => (
          <AccordionItem
            key={index}
            value={curriculum.id.toString()}
            className="border p-1 px-5 rounded-lg bg-background"
          >
            <AccordionTrigger className="font-semibold flex items-center justify-between">
              <span className="text-sm">{curriculum.sectionTitle}</span>
              <div className="flex gap-4 mr-auto ml-4">
                <span className="text-xs font-normal text-slate-500">
                  {curriculum.lessons.length} درس
                </span>
                <span className="text-xs font-normal space-x-3 text-slate-500">
                  {curriculum.lessons.reduce(
                    (acc, curr) => acc + (curr.duration || 0),
                    0
                  )}{" "}
                  دقیقه
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-5 text-slate-500">
                {curriculum.lessons.map((lesson, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="flex gap-2 items-center">
                      {lesson.type === "VIDEO" ? (
                        <Video size={15} />
                      ) : lesson.type === "ASSET" ? (
                        <Download size={15} />
                      ) : (
                        <File size={15} />
                      )}
                      {lesson.title}
                    </span>
                    {lesson.isFree ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Badge variant={"blue"} className="cursor-pointer">
                            نمایش
                          </Badge>
                        </DialogTrigger>
                        <DialogContent className="p-0 border-none max-w-[900px] aspect-video rounded-sm">
                          <DialogTitle className="sr-only" />
                          <CurriculumPlay url={lesson.url} />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Lock className="text-slate-400" size={16} />
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseCurriculum;
