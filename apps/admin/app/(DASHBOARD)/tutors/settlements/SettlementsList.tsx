import Avatar from "@igraph/ui/components/Avatar";
import EditButton from "@igraph/ui/components/EditButton";
import SettlementForm from "@/components/forms/tutor/SettlementForm";
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
import { formatMiladiDate } from "@igraph/utils";
import { formatPrice } from "@igraph/utils";
import { Image, Settlement, Tutor } from "@igraph/database";

export interface SettlementType extends Settlement {
  tutor: Tutor & { image: Image | null };
}

interface Props {
  settlements: SettlementType[];
  totalTutors: number;
  pageSize: number;
}

const SettlementsList = async ({
  settlements,
  totalTutors,
  pageSize,
}: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={settlements} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalTutors} />
    </div>
  );
};

const renderRows = (settlement: SettlementType) => {
  return (
    <TableRow key={settlement.id} className="odd:bg-slate-50">
      <TableCell>
        <div className="flex gap-2 items-center">
          <Avatar src={settlement.tutor.image?.url} size={35} />
          {settlement.tutor.name}
        </div>
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        {formatPrice(settlement.totalSell)}
      </TableCell>

      <TableCell className="text-center">
        <Badge className="aspect-square p-1" variant={"gray"}>
          %{settlement.profit}
        </Badge>
      </TableCell>

      <TableCell
        className={`text-center font-semibold ${settlement.status === "PENDING" ? "text-orange-500" : "text-green-500"}`}
      >
        {formatPrice(settlement.amount)}
      </TableCell>

      <TableCell className="text-center font-semibold text-primary hidden xl:table-cell">
        {formatPrice(settlement.totalSell - settlement.amount)}
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        {settlement.paidAt ? (
          formatMiladiDate(settlement.paidAt)
        ) : (
          <span className="text-gray-400">Not Paid</span>
        )}
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        <Badge variant={settlement.status === "PENDING" ? "orange" : "green"}>
          {settlement.status}
        </Badge>
      </TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild className="flex justify-end">
            <EditButton />
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Settlement</DialogTitle>
              <SettlementForm type="UPDATE" settlement={settlement} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Tutor", className: "" },
  { label: "Total Sell", className: "text-center hidden lg:table-cell" },
  { label: "Profit", className: "text-center" },
  { label: "Paid Amount", className: "text-center" },
  { label: "iG Profit", className: "text-center hidden xl:table-cell" },
  { label: "Paid At", className: "text-center hidden xl:table-cell" },
  { label: "Status", className: "text-center hidden xl:table-cell" },
  {
    label: "Edit",
    className: "text-right w-[60px]",
  },
];

export default SettlementsList;
