import { X_HANDLE, X_URL } from "@/lib/site";

export function XLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** 記事末尾の「Xでも発信中」ボックス */
export default function XFollow() {
  return (
    <aside className="my-10 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-sm font-bold text-gray-900">Xでも発信中</p>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          新着記事のお知らせと、在宅ワークを始めるヒントを毎日お届けしています。
        </p>
      </div>
      <a
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 sm:mt-0 inline-flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-700 transition-colors"
      >
        <XLogo />
        @{X_HANDLE} をフォロー
      </a>
    </aside>
  );
}
