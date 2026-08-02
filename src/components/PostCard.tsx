import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import CategoryBadge from "./CategoryBadge";

type Props = {
  post: PostMeta;
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: Props) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <CategoryBadge category={post.category} asLink />
          <time className="text-xs text-gray-400">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <Link href={`/blog/${post.category}/${post.id}`}>
          <h2 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors leading-snug mb-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${post.category}/${post.id}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          続きを読む →
        </Link>
      </div>
    </article>
  );
}
