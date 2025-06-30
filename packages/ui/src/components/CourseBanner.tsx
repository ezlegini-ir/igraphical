"use client";

import { Course, Image, Post } from "@igraph/database";
import { Button } from "@igraph/ui/components/ui/button";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { getCourseById } from "@igraph/editor/getCourseById";
import { getPostById } from "@igraph/editor/getPostById";
import { cn } from "@igraph/utils";
import Link from "next/link";

interface CourseType extends Course {
  image: Image | null;
}
interface PostType extends Post {
  image: Image | null;
}

const CourseBanner = ({ courseId }: { courseId: string }) => {
  const [resource, setResource] = useState<CourseType | PostType | null>(null);
  const [isCourse, setIsCourse] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      const course = await getCourseById(courseId);
      if (course) {
        setResource(course);
        setIsCourse(true);
      } else {
        const post = await getPostById(courseId);
        if (post) {
          setResource(post);
          setIsCourse(false);
        }
      }
      setLoading(false);
    };

    fetchResource();
  }, [courseId]);

  if (loading) {
    return (
      <div className="bg-muted flex justify-between items-center p-3 border rounded-md text-sm text-center">
        <div className="flex gap-3 items-center ">
          <Skeleton className="h-12 aspect-video" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16 aspect-video" />
            <Skeleton className="h-4 w-32 aspect-video" />
          </div>
        </div>

        <div>
          <Skeleton className="h-8 w-20 aspect-video" />
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="bg-muted rounded-md text-sm text-center">
        پست یافت نشد.
      </div>
    );
  }

  return (
    <div className="p-2 px-3 bg-muted border rounded-md flex justify-between items-center">
      <Link
        className="flex gap-3 items-center"
        href={isCourse ? `/courses/${resource.url}` : `/${resource.url}`}
      >
        <NextImage
          alt=""
          src={resource.image?.url || "/placeholder.svg"}
          width={80}
          height={80}
          className="rounded-md object-cover bg-primary/10 aspect-video"
        />
        <div className="text-right">
          <p
            className={`font-medium p-1 text-xs ${isCourse ? "text-primary" : "text-foreground"}`}
          >
            {isCourse ? "دوره پیشنهادی" : "پیشنهاد مرتبط"}
          </p>
          <p className="font-semibold">{resource.title}</p>
        </div>
      </Link>
      <div className="hidden sm:flex">
        <Link href={isCourse ? `/courses/${resource.url}` : `/${resource.url}`}>
          <Button variant={isCourse ? "default" : "dark"} size="sm">
            {isCourse ? "مشاهده دوره" : "مشاهده پست"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseBanner;

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse h-4 rounded-md bg-black/5", className)} />
);
