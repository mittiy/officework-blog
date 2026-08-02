import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import {
  CATEGORY_COLORS,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_TITLES,
  VALID_CATEGORIES,
  isValidCategory,
} from "@/lib/categories";
import PostCard from "@/components/PostCard";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return {};
  return {
    title: CATEGORY_TITLES[category],
    description: CATEGORY_DESCRIPTIONS[category],
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const posts = await getPostsByCategory(category);
  const { bg, text, border } = CATEGORY_COLORS[category];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          ホーム
        </Link>
        <span>/</span>
        <span className="text-gray-600">{CATEGORY_LABELS[category]}</span>
      </nav>

      {/* Category header */}
      <div className={`${bg} rounded-2xl p-6 mb-8 border ${border}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{CATEGORY_ICONS[category]}</span>
          <h1 className={`text-2xl font-bold ${text}`}>
            {CATEGORY_TITLES[category]}
          </h1>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {CATEGORY_DESCRIPTIONS[category]}
        </p>
        <p className="text-xs text-gray-400 mt-2">全{posts.length}件</p>
      </div>

      {/* Other categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm text-gray-500 self-center mr-1">
          他のカテゴリー:
        </span>
        {VALID_CATEGORIES.filter((c) => c !== category).map((c) => (
          <Link
            key={c}
            href={`/categories/${c}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            {CATEGORY_LABELS[c]}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          このカテゴリーの記事はまだありません。
        </p>
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
