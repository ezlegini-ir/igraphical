import { Badge } from "@igraph/ui/components/ui/badge";
import { CourseCategory } from "@igraph/database";
import Link from "next/link";
import React from "react";

const CourseTitle = ({
  title,
  category,
}: {
  title: string;
  category: CourseCategory;
}) => {
  return (
    <h1 className="text-xl font-semibold flex flex-col gap-1">
      <Link href={`/courses?category=${category.url}`}>
        <Badge variant={"secondary"} className="font-medium">
          {category.name}
        </Badge>
      </Link>
      <span>{title}</span>
    </h1>
  );
};

export default CourseTitle;
