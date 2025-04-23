import { Button } from "@igraph/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import ViewButton from "@igraph/ui/components/ViewButton";
import { formatPrice } from "@igraph/utils";
import { placeHolder } from "@/public";
import Image from "next/image";
import Link from "next/link";
import { PaymentType } from "./PaymentsList";
import { Badge } from "@igraph/ui/components/ui/badge";

const PaymentPreview = ({ payment }: { payment: PaymentType }) => {
  const pending = payment.status === "PENDING";
  const success = payment.status === "SUCCESS";
  const canceled = payment.status === "CANCELED";

  const status = pending ? (
    <Badge className="w-[100px]" variant={"orange"}>
      Pending
    </Badge>
  ) : success ? (
    <Badge className="w-[100px]" variant={"green"}>
      Success
    </Badge>
  ) : canceled ? (
    <Badge className="w-[100px]" variant={"gray"}>
      Canceled
    </Badge>
  ) : (
    <Badge className="w-[100px]" variant={"red"}>
      Failed
    </Badge>
  );

  const paymentPreview = [
    { label: "Payment Id", value: payment.id },
    { label: "Status", value: status },
    {
      label: "User",
      value: payment.user.firstName + " " + payment.user.lastName,
    },
    { label: "Phone", value: payment.user.phone },
    { label: "Email", value: payment.user.email },
    {
      label: "Items Total",
      value: formatPrice(payment.itemsTotal || 0),
    },
    { label: "Discount Code", value: payment.discountCode || "-" },
    {
      label: "Discount Amount",
      value: formatPrice(payment.discountAmount || 0),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ViewButton />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Payment</DialogTitle>
          <div className="space-y-5">
            <div>
              <ul>
                {paymentPreview.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between odd:bg-slate-50 p-3 text-sm  last:font-semibold"
                  >
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>

              <Badge
                className="w-full py-3 flex justify-between text-sm"
                variant={"blue"}
              >
                <span>Paid</span>
                {formatPrice(payment.total)}
              </Badge>
            </div>

            <ul className="space-y-3">
              <DialogTitle>Course(s)</DialogTitle>
              {payment.enrollment.map((item, index) => (
                <li key={index}>
                  <Link
                    href={`/courses/${item.id}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Image
                      alt=""
                      src={item.course?.image?.url || placeHolder}
                      width={70}
                      height={70}
                      className="aspect-video object-cover rounded-sm
                      "
                    />

                    <p>{item.course?.title}</p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex justify-end">
              <Link href={`/enrollments/payments/${payment.id}`}>
                <Button>Edit Payment</Button>
              </Link>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPreview;
