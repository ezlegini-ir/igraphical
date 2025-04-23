import CategoryForm from "@/components/forms/dashboard/post/CategoryForm";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import CategoriesList from "./CategoriesList";
import { globalPageSize, pagination } from "@igraph/utils";
import { database } from "@igraph/database";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;

  const { skip, take } = pagination(page);

  const categories = await database.courseCategory.findMany({
    include: {
      _count: {
        select: {
          courses: true,
        },
      },
    },

    skip,
    take,
  });
  const totalCategories = await database.courseCategory.count();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3>Categories</h3>
        <div className="flex gap-3 justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Category</DialogTitle>
                <CategoryForm type="NEW" categoryFor="COURSE" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CategoriesList
        categories={categories}
        totalCategories={totalCategories}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
