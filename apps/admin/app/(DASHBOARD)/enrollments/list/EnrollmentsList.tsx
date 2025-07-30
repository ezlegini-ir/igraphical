import {
  Course,
  Enrollment,
  Image as ImageType,
  Payment,
  User,
} from "@igraph/database";
import Avatar from "@igraph/ui/components/Avatar";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import { Badge } from "@igraph/ui/components/ui/badge";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@igraph/ui/components/ui/tooltip";
import { formatMiladiDate, formatPrice } from "@igraph/utils";
import Link from "next/link";
import EnrollmentPreview from "./EnrollmentPreview";

export interface EnrollmentType extends Enrollment {
  user: User & { image: ImageType | null };
  course: Course;
  payment: Payment | null;
}

interface Props {
  payments: EnrollmentType[];
  totalPayments: number;
  pageSize: number;
}

const EnrollmentsList = async ({
  payments,
  totalPayments,
  pageSize,
}: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={payments} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPayments} />
    </div>
  );
};

const renderRows = (enrollment: EnrollmentType) => {
  const pending = enrollment.status === "PENDING";
  const in_progress = enrollment.status === "IN_PROGRESS";

  return (
    <TableRow key={enrollment.id} className="odd:bg-slate-50">
      <TableCell>
        <Link
          href={`/students?search=${enrollment.user.email}`}
          className="flex gap-2 items-center"
        >
          <Avatar src={enrollment.user.image?.url} size={34} />
          {enrollment.user.fullName}
        </Link>
      </TableCell>

      <TableCell className="text-left">
        <Link href={`/courses/${enrollment.course.id}`}>
          {enrollment.course.title}
        </Link>
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        {enrollment.price !== 0 ? (
          <div className="flex justify-center">
            {formatPrice(enrollment.price)}
          </div>
        ) : (
          <Badge variant={"green"}>Free</Badge>
        )}
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        <Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="relative w-[100px]">
                {enrollment.status === "IN_PROGRESS" && (
                  <div
                    className={
                      "absolute left-0 top-0 h-full rounded-full bg-blue-500/20"
                    }
                    style={{ width: `${enrollment.progress}%` }}
                  />
                )}

                <Badge
                  className="w-full"
                  variant={pending ? "orange" : in_progress ? "blue" : "green"}
                >
                  {enrollment.status === "PENDING" && "Pending"}
                  {enrollment.status === "IN_PROGRESS" && "In Progress"}
                  {enrollment.status === "COMPLETED" && "Completed"}
                </Badge>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>{enrollment.progress}% complete</p>
            </TooltipContent>
          </Tooltip>

          <TooltipContent>
            <p>{enrollment.progress.toString()}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell className="text-center hidden lg:table-cell">
        {formatMiladiDate(enrollment.enrolledAt)}
      </TableCell>

      <TableCell className="flex gap-2">
        <div className="flex justify-end w-full">
          <EnrollmentPreview enrollment={enrollment} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "User", className: "w-[500px]" },
  { label: "Course", className: "text-left w-[400px]" },
  {
    label: "Price",
    className: "text-center w-[400px] hidden lg:table-cell",
  },
  { label: "Status", className: "text-center w-[500px] hidden lg:table-cell" },
  {
    label: "Enrolled At",
    className: "text-center w-[500px] hidden lg:table-cell",
  },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default EnrollmentsList;
