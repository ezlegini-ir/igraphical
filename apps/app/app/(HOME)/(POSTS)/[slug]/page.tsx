import { database } from "@igraph/database";
import { extractSummaryFromLexical } from "@igraph/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import BlogPost from "./components/BlogPost";

interface Props {
  params: Promise<{ slug: string }>;
}

const getPost = cache(async (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  return await database.post.findFirst({
    where: { url: decodedSlug },
    include: {
      author: true,
      image: true,
      categories: {
        include: {
          category: true,
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            include: { image: true },
          },
        },
      },
    },
  });
});

const page = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getPost(slug);
  console.log("post", post);

  if (!post) return notFound();

  const relatedPosts = await database.post
    .findMany({
      where: {
        id: { not: post.id },
        categories: {
          some: {
            category: {
              name: {
                in: post.categories.map((i) => i.category.name),
              },
            },
          },
        },
      },
      take: 3,
      include: {
        image: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })
    .then((posts) =>
      posts.map((post) => ({
        ...post,
        categories: post.categories.map((c) => c.category),
      }))
    );

  return <BlogPost post={post} relatedPosts={relatedPosts} />;
};

export default page;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) return {};

  const description = extractSummaryFromLexical(post.content).slice(0, 120);

  return {
    title: `${post.title} - وبلاگ`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: [
        {
          url: post.image?.url || "/og-cover.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}
