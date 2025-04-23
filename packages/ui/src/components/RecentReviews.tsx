import CardBox from "@igraph/ui/components/CardBox";
import Table from "@igraph/ui/components/Table";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { Star } from "lucide-react";
import Link from "next/link";
import { ReviewType } from "./ReviewCard";

interface Props {
  reviews: ReviewType[];
}

const RecentReviews = ({ reviews }: Props) => {
  return (
    <CardBox
      btn={{ title: "View All", href: "/courses/reviews" }}
      title="Recent Reviews"
      className="col-span-6"
    >
      <Table
        columns={columns}
        data={reviews}
        renderRows={renderRows}
        noDataMessage="No Data Available"
      />
    </CardBox>
  );
};

const renderRows = (review: ReviewType) => {
  return (
    <TableRow key={review.id} className="text-xs text-gray-500 odd:bg-slate-50">
      <TableCell className="flex flex-col gap-1">
        {review.content}
        <span className="flex items-center gap-1">
          <Link
            dir="rtl"
            className="text-primary/60"
            href={`/courses/${review.course.id}`}
          >
            {review.course.title}
          </Link>
          <div className="flex">
            {Array.from({ length: review.rate }).map((_, index) => (
              <Star
                key={index}
                fill="#eab308"
                className="text-yellow-500"
                size={12}
              />
            ))}
          </div>
        </span>
      </TableCell>
      <TableCell className="text-right">
        <Link
          className="text-primary/60"
          href={`/students?search=${review.user?.email}`}
        >
          {review.user.fullName}
        </Link>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Review", className: "text-left" },
  { label: "Student", className: "w-[150px] text-right" },
];

export default RecentReviews;
