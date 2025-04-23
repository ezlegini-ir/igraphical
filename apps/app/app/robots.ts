import type { MetadataRoute } from "next";
import { privateRoutes } from "@/middleware";

const url = process.env.NEXT_PUBLIC_BASE_URL || "https://igraphical.ir";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes.map((route) => route + "/*"),
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
