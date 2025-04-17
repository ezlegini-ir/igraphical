import SettlementForm from "@/components/forms/tutor/SettlementForm";
import NewButton from "@igraph/ui/components/NewButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { globalPageSize, pagination } from "@igraph/utils";
import { database } from "@igraph/database";
import SettlementsList from "./SettlementsList";
import Filter from "@igraph/ui/components/Filter";
import Search from "@igraph/ui/components/Search";
import { Prisma, SettlementStatus } from "@igraph/database";
interface Props {
  searchParams: Promise<{
    page: string;
    search: string;
    status: SettlementStatus;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search } = await searchParams;
  const { skip, take } = pagination(page);

  const where: Prisma.SettlementWhereInput = {
    status,
    ...(search && search.trim() !== ""
      ? {
          tutor: {
            OR: [
              { name: { contains: search } },
              { displayName: { contains: search } },
              { phone: { contains: search } },
              { email: { contains: search } },
            ],
          },
        }
      : {}),
  };

  const settlements = await database.settlement.findMany({
    where,
    orderBy: { id: "desc" },
    include: {
      tutor: { include: { image: true } },
    },

    skip,
    take,
  });
  const totalSettlements = await database.settlement.count();

  const tutors = await database.tutor.findMany({
    include: { image: true },
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalSettlements} Settlements</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search placeholder="Search Tutors..." />

          <Filter
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Paid", value: "PAID" },
            ]}
            name="status"
            placeholder="All Statuses"
          />

          <Dialog>
            <DialogTrigger asChild>
              <NewButton />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Settlement</DialogTitle>
                <SettlementForm type="NEW" tutors={tutors} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SettlementsList
        settlements={settlements}
        totalTutors={totalSettlements}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
