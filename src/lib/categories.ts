export type Category = "callcenter" | "sns" | "secretary";

export const VALID_CATEGORIES: Category[] = ["callcenter", "sns", "secretary"];

export const CATEGORY_LABELS: Record<Category, string> = {
  callcenter: "コールセンター",
  sns: "SNS運用代行",
  secretary: "オンライン秘書",
};

export const CATEGORY_TITLES: Record<Category, string> = {
  callcenter: "コールセンター・カスタマーサポートの転職情報",
  sns: "SNS運用代行の転職情報",
  secretary: "オンライン秘書・リモートワークの転職情報",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  callcenter:
    "コールセンター・カスタマーサポートへの転職情報。インバウンド・アウトバウンド・SV職など、未経験から始められる職種を紹介します。",
  sns: "SNS運用代行の仕事情報。Instagram・X・TikTokの運用スキル、案件の獲得方法、在宅での働き方を紹介します。",
  secretary:
    "オンライン秘書・リモートワークの仕事情報。スケジュール管理・経理サポート・資料作成など、在宅で活躍できる仕事を紹介します。",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  callcenter: "🎧",
  sns: "📱",
  secretary: "💻",
};

export const CATEGORY_COLORS: Record<
  Category,
  { bg: string; text: string; border: string; gradient: string }
> = {
  callcenter: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    gradient: "from-blue-100 to-blue-200",
  },
  sns: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
    gradient: "from-pink-100 to-pink-200",
  },
  secretary: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
    gradient: "from-emerald-100 to-emerald-200",
  },
};

export function isValidCategory(value: string): value is Category {
  return (VALID_CATEGORIES as string[]).includes(value);
}
