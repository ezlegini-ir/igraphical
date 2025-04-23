import EditButton from "@igraph/ui/components/EditButton";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import { Badge } from "@igraph/ui/components/ui/badge";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import ViewButton from "@igraph/ui/components/ViewButton";
import { formatMiladiDate } from "@igraph/utils";
import { placeHolder } from "@/public";
import {
  Admin,
  Image as ImageType,
  Post,
  PostCategory,
} from "@igraph/database";
import Image from "next/image";
import Link from "next/link";

export interface CategoriesType {
  category: PostCategory;
  postId: number;
  categoryId: number;
}

export type PostType = Post & {
  image: ImageType | null;
  categories: CategoriesType[];
  author: Admin | null;
};

interface Props {
  posts: PostType[];
  totalPosts: number;
  pageSize: number;
}

const PostsList = async ({ posts, totalPosts, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={posts} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalPosts} />
    </div>
  );
};

const renderRows = (post: PostType) => {
  return (
    <TableRow key={post.id} className="odd:bg-slate-50">
      <TableCell>
        <Link
          href={`/posts/${post.id}`}
          className="flex gap-2 items-center text-primary"
        >
          <Image
            alt="post"
            src={post.image?.url || placeHolder}
            width={65}
            height={65}
            className="rounded-sm aspect-video object-cover hidden lg:block bg-muted"
          />
          <span dir="rtl">{post.title}</span>
        </Link>
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {post.author?.name}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        <Badge
          variant={post.status === "DRAFT" ? "gray" : "green"}
          className="w-[100px]"
        >
          {post.status}
        </Badge>
      </TableCell>
      <TableCell className="text-center" dir="rtl">
        {post.categories &&
          post.categories
            ?.map((item) => item.category.name)
            .slice(0, 2)
            .join(", ") +
            (post.categories.length > 2
              ? `، ${post?.categories?.length - 2} دیگر...`
              : "")}
      </TableCell>
      <TableCell className="text-center">
        {(77389).toLocaleString("en-US")}
      </TableCell>
      <TableCell className="text-center hidden xl:table-cell">
        {formatMiladiDate(post.createdAt)}
      </TableCell>
      <TableCell className="lg:flex gap-2 hidden ">
        <EditButton href={`/posts/${post.id}`} />
        <ViewButton href={`${process.env.NEXT_PUBLIC_BASE_URL}/${post?.url}`} />
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Title", className: "w-[550px]" },
  { label: "Author", className: "text-center hidden xl:table-cell" },
  { label: "Status", className: "text-center hidden xl:table-cell" },
  { label: "Category", className: "text-center" },
  { label: "Views", className: "text-center" },
  { label: "Published At", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default PostsList;
