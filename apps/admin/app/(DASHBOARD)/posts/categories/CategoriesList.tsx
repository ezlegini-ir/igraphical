import EditButton from "@igraph/ui/components/EditButton";
import CategoryForm from "@/components/forms/dashboard/post/CategoryForm";
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
import { PostCategory } from "@igraph/database";

type CategoryType = {
  _count: {
    posts: number;
  };
} & PostCategory;

interface Props {
  categories: CategoryType[];
  totalCategories: number;
  pageSize: number;
}

const CategoriesList = ({ categories, totalCategories, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={categories} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalCategories} />
    </div>
  );
};

const renderRows = (category: CategoryType) => {
  return (
    <TableRow key={category.id} className="odd:bg-slate-50">
      <TableCell className="text-left">{category.name}</TableCell>

      <TableCell className="hidden lg:table-cell">{category.url}</TableCell>
      <TableCell>{category._count.posts}</TableCell>
      <TableCell className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>New Category</DialogTitle>
              <CategoryForm
                type="UPDATE"
                category={category}
                categoryFor="POST"
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Name", className: "" },
  { label: "Url", className: "hidden lg:table-cell" },
  { label: "Posts Count", className: "" },
  {
    label: "Actions",
    className: "text-right w-[60px]",
  },
];

export default CategoriesList;
