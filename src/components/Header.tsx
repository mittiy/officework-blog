import Link from "next/link";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  VALID_CATEGORIES,
} from "@/lib/categories";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <div>
              <div className="font-bold text-gray-900 text-base leading-tight">
                オフィスワーク
              </div>
              <div className="text-xs text-indigo-600 font-medium leading-tight">
                転職ナビ
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full shadow-sm hover:from-indigo-600 hover:to-indigo-700 hover:shadow transition-all"
            >
              <span aria-hidden>📰</span>
              記事一覧
            </Link>
            {VALID_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat}`}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all"
              >
                <span aria-hidden>{CATEGORY_ICONS[cat]}</span>
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
