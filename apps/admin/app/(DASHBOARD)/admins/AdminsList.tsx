import Avatar from "@igraph/ui/components/Avatar";
import EditButton from "@igraph/ui/components/EditButton";
import AdminForm from "@/components/forms/dashboard/admin/AdminForm";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import { Badge } from "@igraph/ui/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { Admin, Image as ImageType } from "@igraph/database";

export type AdminType = Admin & { image: ImageType | null };

interface Props {
  admins: AdminType[];
  totalAdmins: number;
  pageSize: number;
}

const AdminsList = async ({ admins, totalAdmins, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={admins} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalAdmins} />
    </div>
  );
};

const renderRows = (admin: AdminType) => {
  return (
    <TableRow key={admin.id} className="odd:bg-slate-50">
      <TableCell>
        <div className="flex gap-2 items-center">
          <Avatar src={admin.image?.url} size={35} />
          {admin.name}
        </div>
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {admin.displayName}
      </TableCell>
      <TableCell className="text-center text-xs font-medium text-gray-500">
        {admin.role === "ADMIN" ? (
          <Badge variant={"blue"}>{admin.role}</Badge>
        ) : (
          admin.role
        )}
      </TableCell>
      <TableCell className="text-center">{admin.email}</TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {admin.phone}
      </TableCell>
      <TableCell className="lg:flex gap-2 hidden ">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Admin</DialogTitle>
              <AdminForm type="UPDATE" admin={admin} />
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
  { label: "Role", className: "text-center" },
  { label: "Email", className: "text-center" },
  { label: "Phone", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default AdminsList;
