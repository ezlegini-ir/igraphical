import Avatar from "@igraph/ui/components/Avatar";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import { Badge } from "@igraph/ui/components/ui/badge";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import ViewButton from "@igraph/ui/components/ViewButton";
import { smartformatJalaliDate } from "@igraph/utils";
import { placeHolder } from "@/public";
import { AskTutor, Course, Image as ImageType, User } from "@igraph/database";
import Image from "next/image";

interface QaType extends AskTutor {
  user: User & { image: ImageType | null };
  course: Course & { image: ImageType | null };
}

interface Props {
  qas: QaType[];
  totalTickets: number;
  pageSize: number;
}

const QaList = async ({ qas, totalTickets, pageSize }: Props) => {
  return (
    <>
      <Table
        columns={columns}
        data={qas}
        renderRows={renderRows}
        noDataMessage="There is yet no messages..."
      />

      <Pagination pageSize={pageSize} totalItems={totalTickets} />
    </>
  );
};

const renderRows = (qa: QaType) => {
  return (
    <TableRow key={qa.id} className="odd:bg-slate-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar src={qa.user.image?.url} />
          {qa.user.fullName}
        </div>
      </TableCell>

      <TableCell className="hidden xl:table-cell">
        <div className="flex items-center gap-3">
          <Image
            alt=""
            src={qa.course.image?.url || placeHolder}
            width={60}
            height={60}
            className="rounded-sm object-center"
          />
          {qa.course.title}
        </div>
      </TableCell>

      <TableCell dir="rtl" className="text-left hidden lg:table-cell">
        {smartformatJalaliDate(qa.createdAt)}
      </TableCell>
      <TableCell dir="rtl" className="text-left">
        {smartformatJalaliDate(qa.updatedAt)}
      </TableCell>

      <TableCell>
        <Badge
          className="p-1 px-3"
          variant={qa.status === "PENDING" ? "orange" : "green"}
        >
          {qa.status}
        </Badge>
      </TableCell>

      <TableCell>
        <ViewButton href={`/qa/${qa.id}`} />
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "User", className: "" },
  { label: "Course", className: "hidden xl:table-cell" },
  { label: "Created At", className: "hidden lg:table-cell" },
  { label: "Last Message", className: "" },
  { label: "Status", className: "" },
  { label: "View", className: "" },
];

export default QaList;
