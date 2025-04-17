import PostForm from "@/components/forms/dashboard/post/PostForm";
import { database } from "@igraph/database";
import React from "react";

const page = async () => {
  const categories = await database.postCategory.findMany();
  const authors = await database.admin.findMany();

  return (
    <div className="space-y-3">
      <h3>Create New Post</h3>

      <PostForm type="NEW" authors={authors} categories={categories} />
    </div>
  );
};

export default page;
