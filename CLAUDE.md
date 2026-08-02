# オフィスワーク転職ナビ (officework-blog)

コールセンター・カスタマーサポート / SNS運用代行 / オンライン秘書(リモートワーク)を扱う転職支援情報ブログ。
tensyoku-blog(genba-tensyoku.com)と同じ構成だが、記事管理はローカルMarkdownではなく **microCMS**。

## 技術構成

- Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript
- `output: "export"` による静的エクスポート(`out/`)
- Cloudflare Workers + 静的アセット配信(wrangler.jsonc / worker.js)。GitHub連携でmainへのpushで自動デプロイ
- 記事はmicroCMSの `blogs` エンドポイントからビルド時に全件取得して静的化(src/lib/posts.ts)

## microCMS

- 環境変数: `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY`(ローカルは `.env.local`、CloudflareはビルドのVariables)
- **未設定の場合はサンプル記事(src/lib/sample-posts.ts)が表示される**。本番ビルドでは必ず設定すること
- APIスキーマ(エンドポイント `blogs`、リスト形式):
  - `title` テキストフィールド(必須)
  - `excerpt` テキストエリア
  - `content` リッチエディタ
  - `category` セレクトフィールド(単一選択・必須): `callcenter` / `sns` / `secretary`
  - `tags` セレクトフィールド(複数選択)またはテキスト(カンマ区切りでも可)
  - `coverImage` 画像(任意)
- 記事URLは `/blog/<category>/<コンテンツID>`。コンテンツIDは手動でSEO向きのslugを付ける(例: `callcenter-mikeiken-guide`)
- microCMSで記事を追加・更新しても**再ビルドするまで反映されない**(静的サイトのため)。反映はCloudflareのデプロイを再実行するか、microCMSのWebhook→Cloudflare Deploy Hookを設定する

## カテゴリ

`callcenter`(🎧青)/ `sns`(📱ピンク)/ `secretary`(💻緑)。定義は src/lib/categories.ts に集約(ラベル・色・説明・アイコン)。カテゴリ追加時はこのファイルだけ更新すればHeader/Footer/トップ/カテゴリページ/sitemapに反映される。

## 運用

- devサーバー: `npm run dev`(port 3001。launch.jsonの `officework-blog`)
- ビルド確認: `npm run build` → `out/` が生成される
- サイトURL定義は src/lib/site.ts(独自ドメイン取得時はこことworker.jsを更新)
