// ChatGPTでサムネを生成できなかったときの代替。既存サムネと同じ白×青の構成で
// public/thumbs/<slug>.jpg (1200x675) を書き出す。
//
// 使い方:
//   node scripts/make-svg-thumb.mjs <slug> <category> "<1行目>" "<2行目(青)>" "<サブタイトル>" "<チップ1>" "<チップ2>" "<チップ3>"
//   category: callcenter | sns | secretary
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const [slug, category, line1, line2, subtitle, ...chips] = process.argv.slice(2);
if (!slug || !category || !line1 || !line2 || !subtitle || chips.length !== 3) {
  console.error(
    'usage: node scripts/make-svg-thumb.mjs <slug> <callcenter|sns|secretary> "<1行目>" "<2行目>" "<サブ>" "<チップ1>" "<チップ2>" "<チップ3>"'
  );
  process.exit(1);
}

const LABELS = {
  callcenter: { text: "コールセンター" },
  sns: { text: "SNS運用代行" },
  secretary: { text: "オンライン秘書" },
};

// sharp(librsvg)はカラー絵文字を描けず黒い四角になるため、アイコンは図形で描く。
// (cx, cy) を中心に、1単位=size/100 の座標系で描画する。
function icon(kind, cx, cy, size, color) {
  const s = size / 100;
  const t = (x, y) => `${cx + x * s},${cy + y * s}`;
  const sw = Math.max(2, 9 * s);
  switch (kind) {
    case "callcenter":
      return `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round">
        <path d="M ${t(-38, 10)} A ${38 * s} ${38 * s} 0 0 1 ${t(38, 10)}"/>
        <path d="M ${t(30, 28)} Q ${t(30, 48)} ${t(8, 50)}"/>
      </g>
      <g fill="${color}">
        <rect x="${cx - 48 * s}" y="${cy + 2 * s}" width="${20 * s}" height="${34 * s}" rx="${8 * s}"/>
        <rect x="${cx + 28 * s}" y="${cy + 2 * s}" width="${20 * s}" height="${34 * s}" rx="${8 * s}"/>
        <circle cx="${cx + 4 * s}" cy="${cy + 50 * s}" r="${7 * s}"/>
      </g>`;
    case "sns":
      return `<rect x="${cx - 26 * s}" y="${cy - 44 * s}" width="${52 * s}" height="${88 * s}" rx="${10 * s}" fill="none" stroke="${color}" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy + 32 * s}" r="${5 * s}" fill="${color}"/>`;
    case "secretary":
      return `<rect x="${cx - 36 * s}" y="${cy - 32 * s}" width="${72 * s}" height="${48 * s}" rx="${5 * s}" fill="none" stroke="${color}" stroke-width="${sw}"/>
      <path d="M ${t(-48, 26)} L ${t(48, 26)} L ${t(40, 36)} L ${t(-40, 36)} Z" fill="${color}"/>`;
  }
  return "";
}
const label = LABELS[category];
if (!label) {
  console.error(`unknown category: ${category}`);
  process.exit(1);
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FONT = "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif";

// タイトルが長いときは文字サイズを詰めて1行に収める(左側 約700pxが目安)
const titleSize = (s) => Math.min(96, Math.floor(700 / Math.max(s.length, 1)));
const W = 1200;
const H = 675;
const chipW = 340;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#e8f0ff"/>
    </linearGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1d4ed8"/>
      <stop offset="1" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1010" cy="250" r="230" fill="#dbeafe"/>
  <circle cx="1080" cy="420" r="120" fill="#bfdbfe"/>
  ${icon(category, 1010, 250, 260, "#2563eb")}
  <path d="M1140 0 L1200 0 L1200 60 Z M1100 675 L1200 575 L1200 675 Z" fill="#2563eb"/>
  <path d="M760 90 l70 -24 l-28 50 z" fill="#3b82f6"/>
  <rect x="60" y="48" rx="26" ry="26" width="${label.text.length * 30 + 110}" height="56" fill="#0f172a"/>
  ${icon(category, 100, 76, 36, "#ffffff")}
  <text x="130" y="88" font-family="${FONT}" font-size="30" font-weight="700" fill="#ffffff">${esc(label.text)}</text>
  <text x="60" y="${200 + 10}" font-family="${FONT}" font-size="${titleSize(line1)}" font-weight="900" fill="#0f172a">${esc(line1)}</text>
  <text x="60" y="${320 + 10}" font-family="${FONT}" font-size="${titleSize(line2)}" font-weight="900" fill="#2563eb">${esc(line2)}</text>
  <rect x="40" y="378" width="${Math.min(subtitle.length * 34 + 80, 760)}" height="62" fill="url(#band)"/>
  <text x="70" y="420" font-family="${FONT}" font-size="32" font-weight="700" fill="#ffffff">${esc(subtitle)}</text>
  ${chips
    .map(
      (c, i) => `
  <rect x="${40 + i * (chipW + 20)}" y="490" rx="18" ry="18" width="${chipW}" height="92" fill="#ffffff" stroke="#bfdbfe" stroke-width="3"/>
  <circle cx="${90 + i * (chipW + 20)}" cy="536" r="26" fill="#dbeafe"/>
  <text x="${90 + i * (chipW + 20)}" y="546" font-size="28" text-anchor="middle" fill="#2563eb" font-family="${FONT}" font-weight="900">✓</text>
  <text x="${130 + i * (chipW + 20)}" y="546" font-family="${FONT}" font-size="${c.length > 10 ? 21 : c.length > 8 ? 24 : 28}" font-weight="700" fill="#0f172a">${esc(c)}</text>`
    )
    .join("")}
</svg>`;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "thumbs", `${slug}.jpg`);
await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(out);
console.log(`wrote ${out}`);
