import Link from "next/link";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type Category,
} from "@/lib/categories";

type Props = {
  category: Category;
  asLink?: boolean;
};

export default function CategoryBadge({ category, asLink = false }: Props) {
  const { bg, text, border } = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  const className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg} ${text} ${border}`;

  if (asLink) {
    return (
      <Link href={`/categories/${category}`} className={className}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
