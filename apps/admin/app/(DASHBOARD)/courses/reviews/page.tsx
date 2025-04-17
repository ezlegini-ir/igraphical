import ReviewForm from "@/components/forms/dashboard/course/ReviewForm";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { globalPageSize, pagination } from "@igraph/utils";
import ReviewsList from "./ReviewsList";
import Search from "@igraph/ui/components/Search";
import { Prisma, database } from "@igraph/database";

interface Props {
  searchParams: Promise<{ page: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, search } = await searchParams;

  const where: Prisma.ReviewWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { course: { title: { contains: search } } },
              { user: { fullName: { contains: search } } },
            ],
          }
        : {},
    ],
  };

  const { skip, take } = pagination(page);
  const reviews = await database.review.findMany({
    where,
    include: {
      course: true,
      user: true,
    },
    orderBy: {
      id: "desc",
    },

    skip,
    take,
  });
  const totalReviews = await database.review.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3>{totalReviews} Reviews</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search
            placeholder="Search Users and Courses...."
            className="w-[250px]"
          />

          <div className="flex gap-3 justify-between items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"sm"} className="px-6 lg:px-10">
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="space-y-6">
                  <DialogTitle>New Comment</DialogTitle>
                  <ReviewForm type="NEW" />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <ReviewsList
        reviews={reviews}
        totalReviews={totalReviews}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
