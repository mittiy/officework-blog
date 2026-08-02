import { createClient, type MicroCMSQueries } from "microcms-js-sdk";
import { isValidCategory, type Category } from "./categories";
import { SAMPLE_POSTS } from "./sample-posts";

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  /** リッチエディタのHTML */
  content: string;
  category: Category;
  tags: string[];
  coverImage?: { url: string; width?: number; height?: number };
  publishedAt: string;
};

export type PostMeta = Omit<Post, "content">;

// microCMSのAPIレスポンス(セレクトフィールドは配列で返る)
type MicroCMSPost = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string[] | string;
  tags?: string[] | string;
  coverImage?: { url: string; width?: number; height?: number };
  publishedAt?: string;
  createdAt: string;
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

const client =
  serviceDomain && apiKey
    ? createClient({ serviceDomain, apiKey })
    : null;

function normalizeCategory(value: MicroCMSPost["category"]): Category {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && isValidCategory(raw)) return raw;
  return "callcenter";
}

function normalizeTags(value: MicroCMSPost["tags"]): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    return value.split(/[,、]/).map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function toPost(item: MicroCMSPost): Post {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt ?? "",
    content: item.content ?? "",
    category: normalizeCategory(item.category),
    tags: normalizeTags(item.tags),
    coverImage: item.coverImage,
    publishedAt: item.publishedAt ?? item.createdAt,
  };
}

async function fetchAllFromMicroCMS(queries?: MicroCMSQueries): Promise<Post[]> {
  if (!client) return [];
  const posts: Post[] = [];
  const limit = 100;
  let offset = 0;
  // 100件超でも全件取得できるようページング
  for (;;) {
    const res = await client.getList<MicroCMSPost>({
      endpoint: "blogs",
      queries: { ...queries, limit, offset, orders: "-publishedAt" },
    });
    posts.push(...res.contents.map(toPost));
    offset += limit;
    if (offset >= res.totalCount) break;
  }
  return posts;
}

let cache: Post[] | null = null;

/**
 * 全記事を取得(ビルド中はメモリキャッシュ)。
 * microCMS未設定時はサンプル記事を返す(本番ビルド前に環境変数を設定すること)。
 */
export async function getAllPosts(): Promise<Post[]> {
  if (cache) return cache;
  if (!client) {
    console.warn(
      "[posts] MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定のため、サンプル記事を表示しています。"
    );
    cache = SAMPLE_POSTS;
    return cache;
  }
  cache = await fetchAllFromMicroCMS();
  return cache;
}

export async function getPostsByCategory(category: Category): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category === category);
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.id === id) ?? null;
}
