import Avatar from "@igraph/ui/components/Avatar";
import EditButton from "@igraph/ui/components/EditButton";
import StudentForm from "@/components/forms/user/StudentForm";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { Image as ImageType, User } from "@igraph/database";
import { formatDistance } from "date-fns";

export type UserType = User & { image: ImageType | null };

interface Props {
  students: UserType[];
  totalStudents: number;
  pageSize: number;
}

const StudentsList = async ({ students, totalStudents, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={students} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalStudents} />
    </div>
  );
};

const renderRows = (student: UserType) => {
  return (
    <TableRow key={student.id} className="odd:bg-slate-50">
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar src={student.image?.url} size={35} />
          {student.fullName}
        </div>
      </TableCell>
      <TableCell className="text-center">{student.email}</TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {student.phone}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {formatDistance(student.joinedAt, new Date(), { addSuffix: true })}
      </TableCell>

      <TableCell className="lg:flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Student</DialogTitle>
              <StudentForm type="UPDATE" user={student} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Name", className: "" },
  { label: "Email", className: "text-center" },
  { label: "Phone", className: "text-center  hidden xl:table-cell" },
  { label: "Student From", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default StudentsList;
