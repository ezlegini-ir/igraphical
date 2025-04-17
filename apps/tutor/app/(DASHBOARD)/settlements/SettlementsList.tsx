import { Image, Settlement, Tutor } from "@igraph/database";
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
import { Separator } from "@igraph/ui/components/ui/separator";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import ViewButton from "@igraph/ui/components/ViewButton";
import { formatJalaliDate, formatPrice } from "@igraph/utils";
import { format } from "date-fns";

export interface SettlementType extends Settlement {
  tutor: Tutor & { image: Image | null };
}

interface Props {
  settlements: SettlementType[];
  totalTutors: number;
  pageSize: number;
}

const SettlementsList = ({ settlements, totalTutors, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={settlements} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalTutors} />
    </div>
  );
};

const renderRows = (settlement: SettlementType) => {
  return (
    <TableRow key={settlement.id} className="odd:bg-slate-50 ">
      <TableCell className="text-left">
        {formatPrice(settlement.totalSell)}
      </TableCell>

      <TableCell className="text-center">
        <Badge className="aspect-square p-1" variant={"gray"}>
          %{settlement.profit}
        </Badge>
      </TableCell>

      <TableCell
        className={`text-center font-semibold ${
          settlement.status === "PENDING" ? "text-orange-500" : "text-green-500"
        }`}
      >
        {formatPrice(settlement.amount)}
      </TableCell>

      <TableCell dir="rtl" className="text-center">
        {settlement.paidAt ? (
          formatJalaliDate(settlement.paidAt, { withTime: true })
        ) : (
          <span className="text-gray-400">Not Paid</span>
        )}
      </TableCell>

      <TableCell className="text-center">
        <Badge variant={settlement.status === "PENDING" ? "orange" : "green"}>
          {settlement.status}
        </Badge>
      </TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild className="flex justify-end">
            <ViewButton />
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Settlement</DialogTitle>
              <SettlementContent settlement={settlement} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const SettlementContent = ({ settlement }: { settlement: SettlementType }) => {
  return (
    <div>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between">
          From:
          <span> {format(settlement?.from, "PPP")}</span>
        </li>

        <li className="flex justify-between">
          To:
          <span> {format(settlement?.to, "PPP")}</span>
        </li>

        <li className="flex justify-between">
          Status:
          <Badge
            variant={settlement?.status === "PENDING" ? "orange" : "green"}
          >
            {settlement?.status}
          </Badge>
        </li>

        <Separator />
        <div className="space-y-1.5 text-right" dir="rtl">
          <h4>نکات قابل توجه:</h4>
          <ul className="list-disc list-inside text-gray-500">
            <span className="font-semibold text-black">
              مدرس محترم آی‌گرافیکال:
            </span>
            <li>
              محاسبه حق فروش شما از ابتدای ماه میلادی تا انتهای ماه میلادی می
              باشد.
            </li>
            <li>
              پرداخت مبلغ محاسبه شده، حداکثر در روز 5ام ماه میلادیِ پیش رو خواهد
              بود.
            </li>
            <li>
              چنانچه در طول دوره مبلغ قابل پرداخت صفر باشد، پرداختی صورت نخواهد
              گرفت اما رکورد آن به عنوان پرداخت شده 0 تومان، ایجاد خواهد شد.
            </li>
          </ul>
        </div>
        <Separator />

        <Badge
          variant={"blue"}
          className="flex p-3 text-base font-semibold justify-between w-full"
        >
          Amount:
          <span> {formatPrice(settlement?.amount)}</span>
        </Badge>
      </ul>
    </div>
  );
};

const columns = [
  { label: "Total Sell", className: "text-left hidden xl:table-cell" },
  { label: "Profit", className: "text-center hidden xl:table-cell" },
  { label: "Paid Amount", className: "text-center hidden xl:table-cell" },
  { label: "Paid At", className: "text-center" },
  { label: "Status", className: "text-center" },
  {
    label: "View",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default SettlementsList;
