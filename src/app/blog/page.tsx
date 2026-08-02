import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { CATEGORY_LABELS, VALID_CATEGORIES } from "@/lib/categories";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "コールセンター・SNS運用代行・オンライン秘書などオフィスワーク転職の記事一覧",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">記事一覧</h1>
        <p className="text-gray-500 text-sm">全{posts.length}件の記事</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm text-gray-500 self-center mr-1">カテゴリー:</span>
        {VALID_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/categories/${cat}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-20">記事がまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
