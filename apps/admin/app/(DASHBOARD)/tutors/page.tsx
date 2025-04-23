import TutorForm from "@/components/forms/tutor/TutorForm";
import NewButton from "@igraph/ui/components/NewButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { database } from "@igraph/database";
import TutorsList from "./TutorsList";
import { globalPageSize, pagination } from "@igraph/utils";
interface Props {
  searchParams: Promise<{ page: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const { skip, take } = pagination(page);

  const tutors = await database.tutor.findMany({
    orderBy: { joinedAt: "asc" },
    include: { image: true },

    skip,
    take,
  });
  const totalTutors = await database.tutor.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Tutors</h3>
        <div className="flex gap-3 justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <NewButton />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Tutor</DialogTitle>
                <TutorForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TutorsList
        tutors={tutors}
        totalTutors={totalTutors}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
