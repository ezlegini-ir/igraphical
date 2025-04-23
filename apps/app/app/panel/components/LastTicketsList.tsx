import Table from "@igraph/ui/components/Table";
import { Badge } from "@igraph/ui/components/ui/badge";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import Link from "next/dist/client/link";
import CardBox from "./CardBox";
import { Ticket } from "@igraph/database";

const LastTicketsList = ({ tickets }: { tickets: Ticket[] }) => {
  const renderRows = (ticket: Ticket) => {
    const pending = ticket.status === "PENDING";
    const replied = ticket.status === "REPLIED";

    return (
      <TableRow key={ticket.id}>
        <TableCell className="text-xs ">
          <Link href={`/panel/tickets/${ticket.id}`}>{ticket.subject}</Link>
        </TableCell>

        <TableCell className="p-3 font-medium text-xs text-left">
          <Badge
            className="font-normal"
            variant={pending ? "orange" : replied ? "green" : "gray"}
          >
            {pending ? "انتظار" : replied ? "پاسخ" : "بسته"}
          </Badge>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <CardBox
      title="آخرین تیکت‌ها"
      btn={{ title: "مشاهده همه", href: "/panel/tickets" }}
      className="min-h-[330px] p-0"
    >
      <div>
        <Table
          columns={columns}
          data={tickets}
          renderRows={renderRows}
          noDataMessage="تاکنون پیامی ارسال نکرده اید"
        />
      </div>
    </CardBox>
  );
};

const columns = [
  { label: "عنوان", className: "text-right w-4/6 text-xs" },
  { label: "وضعیت", className: "text-xs text-left" },
];

export default LastTicketsList;
