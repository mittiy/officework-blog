import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type Category,
} from "@/lib/categories";

export const metadata: Metadata = {
  title: "在宅ワークの始め方 完全ロードマップ",
  description:
    "未経験からコールセンター・SNS運用代行・オンライン秘書で働き始めるまでを6ステップで整理。職種選び、準備、応募、最初の1ヶ月、収入の伸ばし方まで順番に読める保存版ガイドです。",
};

type StepLink = {
  category: Category;
  slug: string;
  title: string;
};

type Step = {
  num: string;
  title: string;
  desc: string;
  links: StepLink[];
};

const STEPS: Step[] = [
  {
    num: "STEP 1",
    title: "職種を選ぶ",
    desc: "在宅・オフィスワーク系の3職種は、それぞれ働き方も向き不向きも違います。まずは各職種のガイドを読んで、自分に合いそうな軸を1つ決めましょう。",
    links: [
      {
        category: "callcenter",
        slug: "callcenter-tensyoku-guide",
        title: "未経験からコールセンターに転職する完全ガイド",
      },
      {
        category: "sns",
        slug: "sns-unyodaiko-hajimekata",
        title: "SNS運用代行の仕事の始め方 5ステップ",
      },
      {
        category: "secretary",
        slug: "online-hisho-shigoto-naiyo",
        title: "オンライン秘書の仕事内容と求められるスキル",
      },
    ],
  },
  {
    num: "STEP 2",
    title: "環境とスキルを整える",
    desc: "在宅で働くなら、静かな作業環境・回線・基本ツールの操作が土台になります。働きながらでも1〜2週間で整えられる範囲です。",
    links: [
      {
        category: "secretary",
        slug: "secretary-obon-junbi",
        title: "5日間でできる、在宅デビューの準備リスト",
      },
      {
        category: "callcenter",
        slug: "callcenter-zaitaku-work",
        title: "在宅コールセンターに必要な環境と求人の探し方",
      },
      {
        category: "sns",
        slug: "sns-unyodaiko-skill",
        title: "SNS運用代行に必要なスキルと3つの武器",
      },
    ],
  },
  {
    num: "STEP 3",
    title: "書類と実績を仕込む",
    desc: "志望動機・ポートフォリオ・選考対策は、応募を始める前に仕込んでおくと通過率が大きく変わります。ここが一番差のつくステップです。",
    links: [
      {
        category: "callcenter",
        slug: "callcenter-shibodoki",
        title: "志望動機はこう書く。未経験でも通る3つの型と例文",
      },
      {
        category: "sns",
        slug: "sns-portfolio-tsukurikata",
        title: "実績ゼロからポートフォリオを作る手順",
      },
      {
        category: "secretary",
        slug: "secretary-senko-taisaku",
        title: "採用選考の対策(タイピング・文章課題・面談)",
      },
    ],
  },
  {
    num: "STEP 4",
    title: "応募して仕事を取る",
    desc: "準備ができたら、複数に同時応募して比較するのが正攻法です。面接・案件応募それぞれの通し方を押さえましょう。",
    links: [
      {
        category: "callcenter",
        slug: "callcenter-mensetsu-taisaku",
        title: "面接でよく聞かれる質問7選と回答のコツ",
      },
      {
        category: "secretary",
        slug: "online-hisho-anken",
        title: "求人・案件の探し方|未経験からの3つのルート",
      },
      {
        category: "sns",
        slug: "sns-platform-hikaku",
        title: "得意なSNSを1つ決めて応募する(プラットフォーム別攻略)",
      },
    ],
  },
  {
    num: "STEP 5",
    title: "最初の1ヶ月を乗り切る",
    desc: "デビュー直後は誰でも不安定。研修の受け方・初案件の回し方・信頼の作り方が分かっていれば、この時期はぐっと楽になります。",
    links: [
      {
        category: "callcenter",
        slug: "callcenter-kenshu-sugoshikata",
        title: "研修では何をする?挫折しない過ごし方",
      },
      {
        category: "sns",
        slug: "sns-hatsu-anken-susumekata",
        title: "初案件の進め方。ヒアリングから初月運用まで",
      },
      {
        category: "secretary",
        slug: "secretary-chat-horenso",
        title: "信頼はチャットで決まる。報連相7つの習慣",
      },
    ],
  },
  {
    num: "STEP 6",
    title: "続けて収入を伸ばす",
    desc: "続けるほど信頼と単価は積み上がります。レポート・掛け持ち・情報管理という「プロの型」を身につけて、長く選ばれる存在になりましょう。",
    links: [
      {
        category: "sns",
        slug: "sns-monthly-report",
        title: "継続契約につながる月次レポートの作り方",
      },
      {
        category: "secretary",
        slug: "secretary-kakemochi-kanri",
        title: "複数クライアントを混乱なく回すタスク管理",
      },
      {
        category: "secretary",
        slug: "secretary-joho-security",
        title: "クライアントに信頼される7つのセキュリティ習慣",
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <p className="text-indigo-200 text-sm font-semibold mb-2">
            🗺️ 保存版ガイド
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            在宅ワークの始め方
            <br />
            完全ロードマップ
          </h1>
          <p className="text-indigo-100 leading-relaxed max-w-2xl">
            未経験から、コールセンター・SNS運用代行・オンライン秘書で働き始めるまでの道のりを6つのステップに整理しました。上から順に読み進めれば、今日やるべきことが見えてきます。
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <ol className="relative border-l-2 border-indigo-200 ml-4 sm:ml-6 space-y-10">
          {STEPS.map((step) => (
            <li key={step.num} className="relative pl-8 sm:pl-10">
              <span className="absolute -left-[1.35rem] top-0 w-10 h-10 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {step.num.replace("STEP ", "STEP")}
              </span>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-bold text-indigo-600 mb-1">
                  {step.num}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {step.desc}
                </p>
                <ul className="space-y-2">
                  {step.links.map((link) => {
                    const colors = CATEGORY_COLORS[link.category];
                    return (
                      <li key={link.slug}>
                        <Link
                          href={`/blog/${link.category}/${link.slug}`}
                          className="group flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                        >
                          <span
                            className={`flex-shrink-0 text-[11px] px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {CATEGORY_ICONS[link.category]}{" "}
                            {CATEGORY_LABELS[link.category]}
                          </span>
                          <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 leading-snug">
                            {link.title}
                          </span>
                          <span className="ml-auto text-indigo-400 group-hover:text-indigo-600">
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div className="mt-12 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            もっと記事を読みたい方へ
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            職種別の記事一覧から、気になるテーマを探せます。
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold rounded-full text-sm hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm"
          >
            記事一覧を見る →
          </Link>
        </div>
      </section>
    </div>
  );
}
