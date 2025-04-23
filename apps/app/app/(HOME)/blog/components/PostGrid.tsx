import React from "react";
import PostCard from "./PostCard";
import { Image, Post, PostCategory } from "@igraph/database";

export interface PostType extends Post {
  image: Image | null;
  categories: PostCategory[];
}

export interface CategoriesType {
  category: PostCategory;
  postId: number;
  categoryId: number;
}

interface Props {
  posts: PostType[];
}

const PostGrid = ({ posts }: Props) => {
  return (
    <div className={"space-y-6"}>
      {posts?.map((post, index) => <PostCard key={index} post={post} />)}
    </div>
  );
};

export default PostGrid;
