import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import ViewButton from "@igraph/ui/components/ViewButton";

type QaQaType = {
  id: number;
  qaId: 1;
  type: "TUTOR" | "STUDENT";
  user: {
    id: number;
    name: string;
  };
  message: string;
  createdAt: Date;
  attachment?: {
    id: number;
    fileUrl: string;
  };
};

export type QaType = {
  id: number;
  status: "PENDING" | "ANSWERED";
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  course: {
    id: number;
    title: string;
    image: { url: string };
  };
  tutor: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  qa: QaQaType[];
};

interface Props {
  qa: QaType[];
  totalQa: number;
}

const QaList = async ({ qa, totalQa }: Props) => {
  const pageSize = 15;

  return (
    <div className="card">
      <Table columns={columns} data={qa} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalQa} />
    </div>
  );
};

const renderRows = (qa: QaType) => {
  return (
    <TableRow key={qa.id} className="odd:bg-slate-50">
      <TableCell>{qa.course.title}</TableCell>
      <TableCell>{qa.user.name}</TableCell>
      <TableCell className="text-center hidden lg:table-cell">
        {qa.tutor.name}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {qa.qa.length}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {qa.createdAt.toLocaleString()} - {qa.updatedAt.toLocaleString()}
      </TableCell>
      <TableCell>
        <ViewButton href={`/qa/${qa.id}`} />
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Course", className: "text-left" },
  { label: "Student", className: "text-left" },
  { label: "Tutor", className: "text-center  hidden lg:table-cell" },
  { label: "Q&A Count", className: "text-center hidden xl:table-cell" },
  {
    label: "Created At / Last Update",
    className: "text-center hidden xl:table-cell",
  },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default QaList;
