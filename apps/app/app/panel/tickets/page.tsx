import { getSessionUser } from "@/data/user";
import FaqBanner from "./components/FaqBanner";
import TicketsList from "./components/TicketsList";
import { database } from "@igraph/database";
import { Prisma, TicketStatus } from "@igraph/database";
import { pagination } from "@igraph/utils";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ time: string; status: string; page: string }>;
}
const page = async ({ searchParams }: Props) => {
  const { status, time, page } = await searchParams;

  const userId = (await getSessionUser())?.id;
  const where: Prisma.TicketWhereInput = {
    status: status as TicketStatus,
    userId,
  };

  const { skip, take } = pagination(page);
  const tickets = await database.ticket.findMany({
    where,
    orderBy: {
      createdAt: time ? "asc" : "desc",
    },

    skip,
    take,
  });

  const ticketsCount = await database.ticket.count({
    where,
  });

  return (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <FaqBanner />
      </div>

      <div>
        <TicketsList tickets={tickets} ticketsCount={ticketsCount} />
      </div>
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "پشتیبانی",
};
