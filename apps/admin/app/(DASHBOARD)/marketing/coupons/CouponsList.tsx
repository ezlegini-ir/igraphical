import EditButton from "@igraph/ui/components/EditButton";
import CouponForm, {
  CouponType,
} from "@/components/forms/marketing/CouponForm";
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
import { Infinity } from "lucide-react";

interface Props {
  coupons: CouponType[];
  totalPayments: number;
}

const CouponsList = async ({ coupons, totalPayments }: Props) => {
  const pageSize = 15;

  return (
    <div className="card">
      <Table columns={columns} data={coupons} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPayments} />
    </div>
  );
};

const renderRows = (coupon: CouponType) => {
  const fixed =
    coupon.type === "FIXED_ON_COURSE" || coupon.type === "FIXED_ON_CART";

  return (
    <TableRow key={coupon.id} className="odd:bg-slate-50">
      <TableCell>{coupon.code}</TableCell>

      <TableCell className="text-center capitalize">
        <Badge className="max-w-[130px]" variant={fixed ? "gray" : "blue"}>
          {coupon.type}
        </Badge>
      </TableCell>

      <TableCell className="text-center">
        {fixed ? formatPrice(coupon.amount) : `%${coupon.amount}`}
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        {coupon.summery}
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        {[
          coupon.courseInclude?.length
            ? `inc: ${coupon.courseInclude.length}`
            : "",
          coupon.courseExclude?.length
            ? `exc: ${coupon.courseExclude.length}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ")}
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        <div className="flex items-center justify-center gap-1">
          {coupon.used || 0}
          <span>/</span>
          {coupon.limit || <Infinity size={17} className="text-gray-400" />}
        </div>
      </TableCell>

      <TableCell
        className={`text-left hidden lg:table-cell font-medium text-primary ${
          coupon.to && coupon.to > new Date() ? "text-primary" : "text-red-400"
        }`}
      >
        {coupon.to ? (
          formatMiladiDate(coupon.to)
        ) : (
          <div className="text-gray-400">No Expiration</div>
        )}
      </TableCell>

      <TableCell>
        <Dialog>
          <div className="flex justify-end w-full">
            <DialogTrigger asChild>
              <EditButton />
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-screen-lg">
            <DialogHeader className="space-y-6">
              <DialogTitle>Update Coupon</DialogTitle>
              <CouponForm type="UPDATE" coupon={coupon} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Coupon Code", className: "w-[150px]" },
  { label: "Type", className: "xl:w-[150px] text-center" },
  {
    label: "Amount",
    className: "text-center  xl:w-[120px]",
  },
  { label: "Summery", className: "text-center  hidden xl:table-cell" },
  { label: "Couress", className: "text-center  hidden xl:table-cell" },
  {
    label: "Used / Limit",
    className: "text-center hidden xl:table-cell w-[250px]",
  },
  {
    label: "Expiration Date",
    className: "text-left w-[200px] hidden lg:table-cell",
  },
  {
    label: "Actions",
    className: "text-right",
  },
];

export default CouponsList;
