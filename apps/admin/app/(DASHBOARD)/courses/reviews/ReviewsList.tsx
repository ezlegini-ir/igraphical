import EditButton from "@igraph/ui/components/EditButton";
import ReviewForm from "@/components/forms/dashboard/course/ReviewForm";
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
import { formatMiladiDate } from "@igraph/utils";
import { Course, Review, User } from "@igraph/database";
import { Star } from "lucide-react";
import Link from "next/link";

export interface ReviewType extends Review {
  course: Course;
  user: User;
}

export interface Props {
  reviews: ReviewType[];
  totalReviews: number;
  pageSize: number;
}

const ReviewsList = ({ reviews, totalReviews, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={reviews} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalReviews} />
    </div>
  );
};

const renderRows = (review: ReviewType) => {
  return (
    <TableRow key={review.id} className="odd:bg-slate-50">
      <TableCell className="text-left">{review.content}</TableCell>

      <TableCell className="hidden md:table-cell">
        <Link href={`/students?search=${review.user.email}`}>
          {review.user.firstName} {review.user.lastName}
        </Link>
      </TableCell>

      <TableCell>
        <div className="flex gap-1 font-medium">
          {Array.from({ length: review.rate }).map((_, index) => (
            <Star
              key={index}
              fill="#facc15"
              className="text-yellow-400"
              size={15}
            />
          ))}
        </div>
      </TableCell>

      <TableCell className="hidden xl:table-cell text-center">
        {formatMiladiDate(review.createdAt)}
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <Link href={`/courses/list?search=${review.course.title}`}>
          {review.course?.title}
        </Link>
      </TableCell>

      <TableCell>
        <Dialog>
          <div className="flex justify-end">
            <DialogTrigger asChild>
              <EditButton />
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>Comment</DialogTitle>
              <ReviewForm type="UPDATE" review={review} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Review", className: "sm:w-1/2" },
  { label: "Student", className: "hidden md:table-cell" },
  { label: "Rate", className: "hidden md:table-cell" },
  { label: "Date", className: "hidden xl:table-cell  text-center" },
  { label: "Course", className: "hidden sm:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default ReviewsList;
