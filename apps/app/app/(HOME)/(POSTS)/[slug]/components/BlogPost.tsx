"use client";

import PostGrid, {
  CategoriesType,
  PostType as MyPostType,
} from "@/app/(HOME)/blog/components/PostGrid";
import CommentForm from "@/components/forms/CommentForm";
import { placeHolder } from "@/public";
import {
  Admin,
  Comment,
  Image as ImageType,
  Post,
  User,
} from "@igraph/database";
import ReadOnlyLexicalEditor from "@igraph/editor/ReadOnlyEditor";
import RecaptchaWrapper from "@igraph/ui/components/RecaptchaWrapper";
import { Button } from "@igraph/ui/components/ui/button";
import { Separator } from "@igraph/ui/components/ui/separator";
import { formatJalaliDate } from "@igraph/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CommentsList from "./CommentsList";
import CopyLink from "./CoptLink";

export interface CommentType extends Comment {
  author: (User & { image: ImageType | null }) | null;
}
interface PostType extends Post {
  image: ImageType | null;
  author: Admin | null;
  categories: CategoriesType[];
  comments: CommentType[];
}

interface Props {
  post: PostType;
  relatedPosts: MyPostType[];
}

type Toc = {
  id: string;
  text: string | null;
  level: string;
}[];

const BlogPost = ({ post, relatedPosts }: Props) => {
  const [tocItems, setTocItems] = useState<Toc>([]);

  const generateTOC = useCallback(() => {
    const content = JSON.parse(post.content);
    const toc: Toc = [];

    function traverseNodes(nodes: any[]) {
      for (const node of nodes) {
        if (node.type === "heading" && node.tag && node.id) {
          toc.push({
            id: node.id,
            text:
              node.children?.map((child: any) => child.text).join(" ") || "",
            level: node.tag.toUpperCase(),
          });
        }
        if (node.children) {
          traverseNodes(node.children);
        }
      }
    }

    try {
      if (content.root && content.root.children) {
        traverseNodes(content.root.children);
      }
      setTocItems(toc);
    } catch (error) {
      console.error("Error parsing Lexical JSON:", error);
    }
  }, [post.content]);

  useEffect(() => {
    generateTOC();
  }, [generateTOC]);

  const handleTOCClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!post) return notFound();

  return (
    <div className="space-y-5 mb-16">
      <div className="text-center space-y-3 mt-10">
        <div className="flex gap-2 justify-center">
          {post?.categories.map((c) => (
            <div key={c.categoryId}>
              <Link href={`/blog/?category=${c.category.url}`}>
                <Button
                  className="bg-primary/10 h-7 rounded-sm"
                  size={"sm"}
                  variant={"secondary"}
                >
                  {c.category.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <h1 className="text-3xl">{post.title}</h1>
        <p className="text-gray-500 text-xs">
          {formatJalaliDate(post.createdAt)}
        </p>
      </div>

      <Image
        height={1300}
        width={1300}
        src={post.image?.url || placeHolder}
        alt={post.title}
        className="w-full h-full aspect-square md:aspect-video object-cover rounded-xl bg-muted"
      />

      <div className="space-y-10">
        <div className="flex flex-wrap md:flex-nowrap gap-5">
          <div className="w-full md:w-3/12 md:sticky top-3 h-min">
            <nav className="card">
              <p className="text-slate-500 font-semibold">فهرست مطالب</p>
              <ul>
                {tocItems.map((item) => (
                  <li
                    key={item.id}
                    className={`hover:text-blue-800 text-sm mb-1.5 ${
                      item.level === "H3"
                        ? "mr-2  text-gray-500"
                        : item.level === "H4"
                          ? "mr-5  text-gray-500"
                          : "font-semibold pt-1.5 "
                    }`}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTOCClick(item.id);
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="w-full md:w-9/12">
            <div className="text-center md:text-right">
              <ReadOnlyLexicalEditor content={post.content} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="border border-b-gray-300 border-dashed" />
          <div className="flex justify-end items-center font-mono">
            <CopyLink id={post.id} />
          </div>
        </div>

        <div className="w-full md:w-9/12 space-y-10 mr-auto items-end">
          <div className="space-y-3">
            <h3>پست های مرتبط</h3>
            <PostGrid posts={relatedPosts} />
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <h3>دیدگاه شما</h3>
              <RecaptchaWrapper>
                <CommentForm postId={post.id} />
              </RecaptchaWrapper>
            </div>

            <Separator />

            <CommentsList comments={post.comments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
