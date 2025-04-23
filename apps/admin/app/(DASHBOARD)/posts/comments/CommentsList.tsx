import EditButton from "@igraph/ui/components/EditButton";
import CommentForm from "@/components/forms/dashboard/post/CommentForm";
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
import { Comment, Post, User } from "@igraph/database";
import Link from "next/link";

interface CommentType extends Comment {
  post: Post;
  author: User | null;
}

interface Props {
  comments: CommentType[];
  totalComments: number;
  pageSize: number;
}

const CommentsList = ({ comments, totalComments, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={comments} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalComments} />
    </div>
  );
};

const renderRows = (comment: CommentType) => {
  return (
    <TableRow key={comment.id} className="odd:bg-slate-50">
      <TableCell className="text-left">
        <p>{comment.content}</p>
      </TableCell>

      <TableCell className="hidden md:table-cell text-xs text-center ">
        {comment.author ? (
          <Link href={`/students?search=${comment.author?.email}`}>
            <p className="flex flex-col items-center">
              <span>{comment.author.fullName}</span>
              <span>{comment.author.email}</span>
            </p>
          </Link>
        ) : (
          <p className="font-medium text-gray-500"> GUEST</p>
        )}
      </TableCell>

      <TableCell className="hidden xl:table-cell text-xs text-center">
        {formatMiladiDate(comment.createdAt)}
      </TableCell>

      <TableCell className="hidden sm:table-cell text-xs">
        <Link href={`/posts/${comment.postId}`}>{comment.post?.title}</Link>
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
              <CommentForm type="UPDATE" comment={comment} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Comment", className: "sm:w-1/2" },
  { label: "User", className: "hidden md:table-cell text-center" },
  { label: "Date", className: "hidden xl:table-cell text-center" },
  { label: "Post", className: "hidden sm:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[50px]",
  },
];

export default CommentsList;
