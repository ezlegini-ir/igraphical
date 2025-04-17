/** @type {import('next-sitemap').IConfig} */

const privateRoutes = [
  "/panel",
  "/api",
  "/cart",
  "/quick-cart",
  "/classroom",
  "/checkout-result",
];

export default {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", disallow: privateRoutes }],
  },
  exclude: privateRoutes,
};
