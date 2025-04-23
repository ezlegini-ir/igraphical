import Filter from "@igraph/ui/components/Filter";
import NewButton from "@igraph/ui/components/NewButton";
import Search from "@igraph/ui/components/Search";
import PostsList from "./PostsList";
import { database } from "@igraph/database";
import { PostStatus } from "@igraph/database";
import { getSessionAdmin } from "@/data/admin";
import { globalPageSize, pagination } from "@igraph/utils";
interface Props {
  searchParams: Promise<{ page: string; filter: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, filter, search } = await searchParams;
  const sessionId = await getSessionAdmin();
  const { skip, take } = pagination(page);

  const where = {
    status:
      filter === "all" || filter === "my-posts"
        ? undefined
        : (filter as PostStatus),
    authorId: filter === "my-posts" ? sessionId?.id! : undefined,
    title: { contains: search },
  };

  const posts = await database.post.findMany({
    where,
    include: {
      image: true,
      categories: { include: { category: true } },
      author: true,
    },
    orderBy: { id: "desc" },

    skip,
    take,
  });
  const totalPosts = await database.post.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>
          {totalPosts} {totalPosts > 1 ? "Posts" : "Post"}
        </h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            defaultValue="all"
            placeholder="All Posts"
            options={[
              { label: "All Posts", value: "all" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Drafts", value: "DRAFT" },
              { label: "My Posts", value: "my-posts" },
            ]}
          />

          <NewButton href="/posts/new" title="New Post" />
        </div>
      </div>

      <PostsList
        posts={posts}
        totalPosts={totalPosts}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
