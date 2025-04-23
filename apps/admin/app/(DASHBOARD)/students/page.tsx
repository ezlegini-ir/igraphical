import StudentForm from "@/components/forms/user/StudentForm";
import NewButton from "@igraph/ui/components/NewButton";
import Search from "@igraph/ui/components/Search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { database } from "@igraph/database";
import StudentsList from "./StudentsList";
import { globalPageSize, pagination } from "@igraph/utils";
interface Props {
  searchParams: Promise<{ page: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, search } = await searchParams;
  const { skip, take } = pagination(page);

  const where = search
    ? {
        OR: [
          { email: { contains: search } },
          { phone: { contains: search } },
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { fullName: { contains: search } },
          { nationalId: { contains: search } },
        ],
      }
    : {};

  const students = await database.user.findMany({
    where,
    orderBy: { id: "desc" },
    include: { image: true },

    skip,
    take,
  });
  const totalStudents = await database.user.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalStudents} Students</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Dialog>
            <DialogTrigger asChild>
              <NewButton title="New Student" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Student</DialogTitle>
                <StudentForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <StudentsList
        students={students}
        totalStudents={totalStudents}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
