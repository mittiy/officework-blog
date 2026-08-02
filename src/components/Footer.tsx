import Link from "next/link";
import { CATEGORY_LABELS, VALID_CATEGORIES } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏢</span>
              <div>
                <div className="font-bold text-white text-base leading-tight">
                  オフィスワーク
                </div>
                <div className="text-xs text-indigo-400 leading-tight">転職ナビ</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              コールセンター・SNS運用代行・オンライン秘書など、オフィスワーク&在宅ワークへの転職情報ブログです。
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">カテゴリー</h3>
            <ul className="space-y-2">
              {VALID_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/categories/${cat}`}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {CATEGORY_LABELS[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  記事一覧
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
