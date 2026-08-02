import type { Post } from "./posts";

/**
 * microCMS未設定時にレイアウト確認用として表示されるサンプル記事。
 * 環境変数(MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY)を設定すると使われなくなる。
 */
export const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-callcenter-guide",
    title: "【サンプル】未経験からコールセンターに転職する完全ガイド",
    excerpt:
      "コールセンターは未経験からでも始めやすい人気の職種。仕事内容・給与相場・面接対策までまとめました。",
    content:
      "<p>これはサンプル記事です。microCMSを設定すると、実際の記事が表示されます。</p><h2>コールセンターの仕事内容</h2><p>インバウンド(受信)とアウトバウンド(発信)の2種類があります。</p><ul><li>インバウンド: 問い合わせ対応・注文受付</li><li>アウトバウンド: 営業電話・アンケート調査</li></ul><h2>まとめ</h2><p>未経験でも研修制度が充実している職場が多く、始めやすい仕事です。</p>",
    category: "callcenter",
    tags: ["未経験", "転職ガイド"],
    publishedAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "sample-sns-startup",
    title: "【サンプル】SNS運用代行の仕事を始めるには?必要スキルと案件の探し方",
    excerpt:
      "InstagramやXの運用代行は在宅でできる人気の仕事。必要なスキルと最初の案件の取り方を解説します。",
    content:
      "<p>これはサンプル記事です。microCMSを設定すると、実際の記事が表示されます。</p><h2>SNS運用代行とは</h2><p>企業のSNSアカウントの投稿作成・分析・コメント対応を代行する仕事です。</p><h2>まとめ</h2><p>実績作りから始めて、少しずつ単価を上げていきましょう。</p>",
    category: "sns",
    tags: ["在宅ワーク", "副業"],
    publishedAt: "2026-07-30T00:00:00.000Z",
  },
  {
    id: "sample-secretary-skills",
    title: "【サンプル】オンライン秘書に必要なスキルとは?未経験からの始め方",
    excerpt:
      "スケジュール管理・メール対応・資料作成など、オンライン秘書の仕事内容と求められるスキルを紹介します。",
    content:
      "<p>これはサンプル記事です。microCMSを設定すると、実際の記事が表示されます。</p><h2>オンライン秘書の仕事内容</h2><table><thead><tr><th>業務</th><th>内容</th></tr></thead><tbody><tr><td>スケジュール管理</td><td>会議調整・リマインド</td></tr><tr><td>経理サポート</td><td>請求書発行・経費精算</td></tr></tbody></table><h2>まとめ</h2><p>事務経験があれば活かしやすく、完全在宅で働ける仕事です。</p>",
    category: "secretary",
    tags: ["在宅ワーク", "未経験"],
    publishedAt: "2026-07-28T00:00:00.000Z",
  },
];
