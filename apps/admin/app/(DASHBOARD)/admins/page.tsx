import Filter from "@igraph/ui/components/Filter";
import AdminForm from "@/components/forms/dashboard/admin/AdminForm";
import NewButton from "@igraph/ui/components/NewButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { database } from "@igraph/database";
import { AdminRole } from "@igraph/database";
import AdminsList from "./AdminsList";
import { globalPageSize, pagination } from "@igraph/utils";
interface Props {
  searchParams: Promise<{ page: string; filter: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, filter } = await searchParams;
  const { skip, take } = pagination(page);

  const where = {
    role: filter === "all" ? undefined : (filter as AdminRole),
  };

  const admins = await database.admin.findMany({
    where,
    orderBy: { joinedAt: "desc" },
    include: {
      image: true,
    },

    skip,
    take,
  });
  const totalAdmins = await database.admin.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalAdmins} Admins</h3>
        <div className="flex gap-3 justify-between items-center">
          <Filter
            defaultValue="all"
            placeholder="All Admins"
            options={[
              { label: "All Admins", value: "all" },
              { label: "Adminstrators", value: "ADMIN" },
              { label: "Authors", value: "AUTHOR" },
            ]}
          />

          <Dialog>
            <DialogTrigger asChild>
              <NewButton />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Admin</DialogTitle>
                <AdminForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AdminsList
        admins={admins}
        totalAdmins={totalAdmins}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
