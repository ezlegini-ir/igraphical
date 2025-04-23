import Filter from "@igraph/ui/components/Filter";
import Search from "@igraph/ui/components/Search";
import { globalPageSize, pagination } from "@igraph/utils";
import { database } from "@igraph/database";
import { AskTutorStatus, Prisma } from "@igraph/database";
import QaList from "./QaList";
import { getSessionTutor } from "@/data/tutor";

interface Props {
  searchParams: Promise<{
    page: string;
    status: AskTutorStatus;
    search: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search } = await searchParams;
  const tutorId = (await getSessionTutor())?.id;

  const where: Prisma.AskTutorWhereInput = {
    tutorId,
    status: status || undefined,
    user: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { phone: { contains: search } },
            { nationalId: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
  };

  const { skip, take } = pagination(page);
  const tickets = await database.askTutor.findMany({
    where,
    include: {
      user: {
        include: { image: true },
      },
      course: {
        include: { image: true },
      },
    },
    orderBy: { updatedAt: "desc" },

    skip,
    take,
  });

  const totalTickets = await database.askTutor.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalTickets} Question & Answers</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search placeholder="Search Users..." />

          <Filter
            placeholder="All Statuses"
            name="status"
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Replied", value: "REPLIED" },
            ]}
          />
        </div>
      </div>

      <div className="card">
        <QaList
          qas={tickets}
          totalTickets={totalTickets}
          pageSize={globalPageSize}
        />
      </div>
    </div>
  );
};

export default page;
