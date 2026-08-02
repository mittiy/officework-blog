import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  VALID_CATEGORIES,
} from "@/lib/categories";
import HeroIllustration from "@/components/HeroIllustration";

const CATEGORY_HOME_DESCRIPTIONS = {
  callcenter:
    "インバウンド・アウトバウンド・SV職など、未経験から始めやすいコールセンター/カスタマーサポートの転職情報",
  sns: "Instagram・X・TikTokの運用スキルと案件獲得のコツ。在宅でできるSNS運用代行の仕事ガイド",
  secretary:
    "スケジュール管理・経理サポート・資料作成など、完全在宅で働けるオンライン秘書の仕事情報",
} as const;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 7);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              オフィスワーク・在宅ワークへの
              <br />
              転職を成功させよう
            </h1>
            <p className="text-indigo-100 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              コールセンター・SNS運用代行・オンライン秘書。未経験からの始め方、働き方のリアル、案件の探し方までお届けします。
            </p>
            <div className="flex flex-wrap gap-3">
              {VALID_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat}`}
                  className="inline-flex items-center px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-full text-sm hover:bg-indigo-50 transition-colors shadow"
                >
                  {CATEGORY_LABELS[cat]}の記事を見る
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[440px] lg:flex-shrink-0">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">カテゴリーから探す</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VALID_CATEGORIES.map((cat) => {
            const { text } = CATEGORY_COLORS[cat];
            return (
              <Link
                key={cat}
                href={`/categories/${cat}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{CATEGORY_ICONS[cat]}</div>
                <h3 className={`font-bold text-lg mb-2 ${text}`}>
                  {CATEGORY_LABELS[cat]}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {CATEGORY_HOME_DESCRIPTIONS[cat]}
                </p>
                <div className="mt-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                  記事を見る →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest posts */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">最新記事</h2>
        {latestPosts.length === 0 ? (
          <p className="text-gray-500 text-center py-12">記事がまだありません。</p>
        ) : (
          <>
            <div className="space-y-4">
              {latestPosts.map((post) => {
                const colors = CATEGORY_COLORS[post.category];
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.category}/${post.id}`}
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div
                      className={`w-24 h-16 sm:w-28 sm:h-[72px] flex-shrink-0 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-3xl sm:text-4xl`}
                      aria-hidden
                    >
                      {CATEGORY_ICONS[post.category]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {CATEGORY_LABELS[post.category]}
                        </span>
                        <time className="text-xs text-gray-400">
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                      <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-indigo-700 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold rounded-full text-sm hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm"
              >
                過去記事を見る →
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
