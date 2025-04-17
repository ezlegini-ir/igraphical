import EnrollmentStatusForm from "@/components/forms/payment/EnrollmentStatusForm";
import { Badge } from "@igraph/ui/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import ViewButton from "@igraph/ui/components/ViewButton";
import { formatMiladiDate } from "@igraph/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { EnrollmentType } from "./EnrollmentsList";
import { formatPrice } from "@igraph/utils";

const EnrollmentPreview = ({ enrollment }: { enrollment: EnrollmentType }) => {
  const pending = enrollment.status === "PENDING";
  const in_progress = enrollment.status === "IN_PROGRESS";

  const statuses = pending ? (
    <Badge className="w-[100px]" variant={"orange"}>
      Pending
    </Badge>
  ) : in_progress ? (
    <Badge className="w-[100px]" variant={"blue"}>
      In Progress
    </Badge>
  ) : (
    <Badge className="w-[100px]" variant={"green"}>
      Completed
    </Badge>
  );

  const payment = (
    <Link
      href={`/enrollments/payments/${enrollment.paymentId}`}
      className="flex gap-1 items-start"
    >
      {enrollment.payment?.id} <ExternalLink size={10} />
    </Link>
  );

  const price = enrollment.price ? (
    <Link
      href={`/courses/${enrollment.course.id}`}
      className="flex gap-1 items-start"
    >
      {formatPrice(enrollment.price)} <ExternalLink size={10} />
    </Link>
  ) : (
    <Badge variant={"green"}>Free</Badge>
  );

  const paymentPreview = [
    { label: "Enrollment Id", value: enrollment.id },
    { label: "Course", value: enrollment.course.title },
    { label: "Price", value: price },
    { label: "Status", value: statuses },
    { label: "Payment Id", value: payment },
    {
      label: "Payment Total",
      value: formatPrice(enrollment.payment?.total),
    },
    {
      label: "User",
      value: enrollment.user.fullName,
    },
    { label: "Phone", value: enrollment.user.phone },
    { label: "Email", value: enrollment.user.email },
    { label: "Enrolled At", value: formatMiladiDate(enrollment.enrolledAt) },
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
            <ul>
              {paymentPreview.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between odd:bg-slate-50 p-3 text-sm"
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>

            <EnrollmentStatusForm enrollment={enrollment} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentPreview;
