import QueryCard from "@igraph/ui/components/QueryCard";
import YoutubeRefer from "@igraph/ui/components/YoutubeRefer";
import PostGrid from "./components/PostGrid";
import PageTitle from "@igraph/ui/components/PageTitle";
import { database } from "@igraph/database";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<{ category: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { category } = await searchParams;

  const postCategories = (await database.postCategory.findMany()).map(
    (item) => ({
      label: item.name,
      value: item.url,
    })
  );

  const posts = await database.post.findMany({
    where: {
      status: "PUBLISHED",
      categories: category ? { some: { url: category } } : undefined,
    },
    include: {
      categories: true,
      image: true,
    },
    orderBy: { id: "desc" },
  });

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
          <PostGrid posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "وبلاگ",
  description:
    "مطالب تخصصی، آموزش‌های رایگان، بررسی ابزارها، تکنیک‌ها و ترفندهای کاربردی در طراحی گرافیک، بسته‌بندی، موشن گرافیک، و طراحی رابط کاربری.",
};
