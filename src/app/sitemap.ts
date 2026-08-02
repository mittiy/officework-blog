import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { VALID_CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts: MetadataRoute.Sitemap = (await getAllPosts()).map((post) => ({
    url: `${SITE_URL}/blog/${post.category}/${post.id}`,
    lastModified: new Date(post.publishedAt),
  }));

  const categories: MetadataRoute.Sitemap = VALID_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/categories/${cat}`,
  }));

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/blog` },
    ...categories,
    ...posts,
  ];
}
