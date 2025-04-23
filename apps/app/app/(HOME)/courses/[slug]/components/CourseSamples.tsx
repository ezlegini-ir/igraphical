import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { ScrollArea } from "@igraph/ui/components/ui/scroll-area";
import Image from "next/image";

interface Props {
  exercises:
    | {
        title: string;
        url: string;
      }[]
    | undefined;
}

const CourseExercise = ({ exercises }: Props) => {
  return (
    exercises && (
      <div>
        <h2 className="text-lg font-semibold mb-3">
          تمرینات و بخش هایی از این دوره:
        </h2>

        <ScrollArea className="rounded-md h-96 lg:h-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-2 px-4">
            {exercises.map((item, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Image
                    key={index}
                    alt={`Sample ${index + 1}`}
                    src={item.url}
                    width={300}
                    height={300}
                    draggable={false}
                    className="rounded-lg aspect-square object-cover cursor-pointer"
                  />
                </DialogTrigger>

                <DialogContent className="w-fit gap-2 p-1.5 border-none pb-2 bg-slate-700 flex flex-col items-center">
                  <Image
                    key={index}
                    alt={`Sample ${index + 1}`}
                    src={item.url}
                    width={800}
                    height={800}
                    draggable={false}
                    className="rounded-lg bg-muted-foreground"
                  />
                  <DialogTitle className="text-gray-400 text-sm font-medium">
                    نمونه ای از تمرینات یا بخشی از این دوره
                  </DialogTitle>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  );
};

export default CourseExercise;
