import Avatar from "@igraph/ui/components/Avatar";
import EditButton from "@igraph/ui/components/EditButton";
import TutorForm from "@/components/forms/tutor/TutorForm";
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
import { Image as ImageType, Tutor } from "@igraph/database";
import { formatDistance } from "date-fns";

export type TutorType = Tutor & { image: ImageType | null };

interface Props {
  tutors: TutorType[];
  totalTutors: number;
  pageSize: number;
}

const TutorsList = async ({ tutors, totalTutors, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={tutors} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalTutors} />
    </div>
  );
};

const renderRows = (tutor: TutorType) => {
  return (
    <TableRow key={tutor.id} className="odd:bg-slate-50">
      <TableCell>
        <div className="flex gap-2 items-center">
          <Avatar src={tutor.image?.url} size={35} />
          {tutor.name}
        </div>
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {tutor.displayName}
      </TableCell>

      <TableCell className="text-center">{tutor.email}</TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {tutor.phone}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {formatDistance(tutor.joinedAt, new Date(), { addSuffix: true })}
      </TableCell>
      <TableCell className="lg:flex gap-2 hidden ">
        <Dialog>
          <DialogTrigger asChild className="flex justify-end">
            <EditButton />
          </DialogTrigger>
          <DialogContent className="w-full max-w-screen-lg">
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Admin</DialogTitle>
              <TutorForm type="UPDATE" tutor={tutor} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Name", className: "" },
  { label: "Display Name", className: "text-center hidden xl:table-cell" },
  { label: "Email", className: "text-center" },
  { label: "Phone", className: "text-center hidden xl:table-cell" },
  { label: "Tutor From", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default TutorsList;
