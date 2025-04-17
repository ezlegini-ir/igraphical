import Avatar from "@igraph/ui/components/Avatar";
import { TicketType } from "@/components/forms/ticket/TicketForm";
import Pagination from "@igraph/ui/components/Pagination";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import { Separator } from "@igraph/ui/components/ui/separator";
import { formatMiladiDate } from "@igraph/utils";
import { Eye, Frown } from "lucide-react";
import Link from "next/link";

interface Props {
  tickets: TicketType[];
  totalTickets: number;
  pageSize: number;
}

const TicketsList = async ({ tickets, totalTickets, pageSize }: Props) => {
  return (
    <>
      {tickets.length === 0 && (
        <div className="py-10 card flex flex-col items-center text-gray-500">
          <Frown size={70} />
          <span>No Data Available</span>
        </div>
      )}
      <div className="space-y-3">
        <div className="space-y-5">
          {tickets.map((ticket, index) => (
            <TicketCard key={index} ticket={ticket} />
          ))}
        </div>

        <Pagination pageSize={pageSize} totalItems={totalTickets} />
      </div>
    </>
  );
};

const TicketCard = ({ ticket }: { ticket: TicketType }) => {
  const pending = ticket.status === "PENDING";
  const replied = ticket.status === "REPLIED";

  const statuses = (
    <Badge
      className={`font-medium w-[100px] text-sm  flex justify-center py-2 px-4`}
      variant={pending ? "orange" : replied ? "green" : "gray"}
    >
      <div className="md:hidden">
        {pending ? "Pending" : replied ? "Answered" : "Closed"}
      </div>
      <div className="hidden md:block">
        {pending ? "Pending" : replied ? "Replied" : "Closed"}
      </div>
    </Badge>
  );

  return (
    <div className="card group space-y-4">
      <div className="flex flex-col lg:flex-row gap-5 justify-between lg:items-center">
        <div className="flex items-center gap-2">
          <Avatar src={ticket.user.image?.url} />
          <div className="flex flex-col gap-0">
            <p className="w-full h-6">{ticket.user.fullName}</p>
            <div className="flex gap-2">
              <p className="text-xs text-gray-500">
                <span className="font-semibold">Created At:</span>{" "}
                {ticket.createdAt.toLocaleString()}
              </p>
              <div>
                <Separator orientation="vertical" className="hidden lg:block" />
              </div>
              <p className="text-xs text-gray-500 hidden xl:block">
                <span className="font-semibold">Last Update:</span>{" "}
                {formatMiladiDate(ticket.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Badge className="w-[100px]" variant={"secondary"}>
            {ticket.department}
          </Badge>{" "}
          {statuses}{" "}
          <div>
            <Link href={`/tickets/${ticket.id}`}>
              <Button variant={"lightBlue"}>
                <Eye /> View
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <p
        dir="rtl"
        className="bg-slate-50 border p-3 px-6 text-xs rounded-sm text-gray-500  flex-col gap-2 hidden lg:flex"
      >
        <span className="font-semibold text-base text-primary">
          {ticket.subject}
        </span>
        <span>{ticket.messages[0]?.message.slice(0, 250)}...</span>
      </p>
    </div>
  );
};

export default TicketsList;
