import QueryCard from "@igraph/ui/components/QueryCard";
import YoutubeRefer from "@igraph/ui/components/YoutubeRefer";
import PostGrid from "./components/PostGrid";
import PageTitle from "@igraph/ui/components/PageTitle";
import { database, Prisma } from "@igraph/database";
import { Metadata } from "next";
import { pagination } from "@igraph/utils";
import Pagination from "@igraph/ui/components/Pagination";
import { getPostCategories } from "@/data/post";

interface Props {
  searchParams: Promise<{ category: string; page: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { category, page } = await searchParams;

  const postCategories = await getPostCategories();

  const pageSize = 15;
  const { skip, take } = pagination(page, pageSize);

  const where: Prisma.PostWhereInput = {
    status: "PUBLISHED",
    ...(category && {
      categories: {
        some: {
          category: {
            name: category,
          },
        },
      },
    }),
  };

  const posts = (
    await database.post.findMany({
      where,
      include: {
        categories: true,
        image: true,
      },
      orderBy: { id: "desc" },

      take,
      skip,
    })
  ).map((post) => ({
    ...post,
    categories: post.categories.map((category) => ({
      id: category.categoryId,
      name: "Category Name Placeholder", // Replace with actual logic to fetch the name
      url: "Category URL Placeholder", // Replace with actual logic to fetch the URL
    })),
  }));
  const totalPosts = await database.post.count({ where });

  return (
    <div className="mb-20">
      <PageTitle
        title={"وبلاگ آی‌گرافیکال"}
        description={
          "شما می توانید مقالات آموزشی آی‌گرافیکال را در این صفحه پیدا کنید."
        }
      />

      <div className="flex flex-wrap md:flex-nowrap gap-6 ">
        <div className="w-full md:w-5/12 lg:w-3/12 space-y-3">
          <QueryCard
            options={postCategories}
            title="دسته بندی ها"
            name="category"
          />
          <YoutubeRefer />
        </div>

        <div className="w-full md:w-10/12 lg:w-11/12">
          <div className="flex flex-col items-center gap-12">
            <PostGrid posts={posts} />
            <Pagination pageSize={pageSize} totalItems={totalPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "وبلاگ",
  description:
    "مطالب تخصصی، آموزش‌های رایگان، بررسی ابزارها، تکنیک‌ها و ترفندهای کاربردی در طراحی گرافیک، بسته‌بندی، موشن گرافیک، و طراحی رابط کاربری.",
};
