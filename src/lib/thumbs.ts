import fs from "fs";
import path from "path";

const thumbsDir = path.join(process.cwd(), "public/thumbs");

/**
 * ローカルサムネ(public/thumbs/<記事ID>.jpg)があればその公開パスを返す。
 * ビルド時(サーバーコンポーネント)専用。無い記事はnull(絵文字サムネにフォールバック)。
 */
export function getThumbPath(id: string): string | null {
  const exists = fs.existsSync(path.join(thumbsDir, `${id}.jpg`));
  if (process.env.THUMB_DEBUG) {
    console.log(`[thumbs] cwd=${process.cwd()} id=${id} exists=${exists}`);
  }
  return exists ? `/thumbs/${id}.jpg` : null;
}
