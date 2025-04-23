import { staticRoutes } from "@/middleware";
import { database } from "@igraph/database";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const url = process.env.NEXT_PUBLIC_BASE_URL || "https://igraphical.ir";
type ChangeFreq =
  | "daily"
  | "yearly"
  | "monthly"
  | "weekly"
  | "always"
  | "hourly"
  | "never"
  | undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //! 0) Home Route
  const homePath = {
    url,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as ChangeFreq,
    priority: 1.0,
  };

  //! 1) Static routes
  const staticPaths = staticRoutes.map((path) => ({
    url: `${url + path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "yearly" as ChangeFreq,
    priority: 0.5,
  }));

  //! 2) Courses (only published)
  const courses = await database.course.findMany({
    where: { status: "PUBLISHED" },
    select: { url: true, updatedAt: true },
  });
  const coursePaths = courses.map(({ url: courseUrl, updatedAt }) => ({
    url: `${url}/courses/${encodeURIComponent(courseUrl)}`,
    lastModified: updatedAt.toISOString(),
    changeFrequency: "monthly" as ChangeFreq,
    priority: 0.8,
  }));

  //! 3) Blog posts (only published)
  const posts = await database.post.findMany({
    where: { status: "PUBLISHED" },
    select: { url: true, updatedAt: true },
  });
  const postPaths = posts.map(({ url: postUrl, updatedAt }) => ({
    url: `${url}/${encodeURIComponent(postUrl)}`,
    lastModified: updatedAt.toISOString(),
    changeFrequency: "weekly" as ChangeFreq,
    priority: 0.8,
  }));

  //! 4) Tutors
  const tutors = await database.tutor.findMany({
    select: { slug: true },
  });
  const tutorPaths = tutors.map(({ slug }) => ({
    url: `${url}/tutors/${encodeURIComponent(slug)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as ChangeFreq,
    priority: 0.6,
  }));

  return [
    homePath,
    ...tutorPaths,
    ...postPaths,
    ...coursePaths,
    ...staticPaths,
  ];
}
