/** @format */

import { Grid } from "lucide-react";
import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  id?: number;
  clickable?: boolean;
};

export default function CategoryBadge({
  name,
  id,
  clickable = false,
}: CategoryBadgeProps) {
  const content = (
    <div className="inline-flex items-center text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
      <Grid className="h-3 w-3 mr-1" />
      {name}
    </div>
  );

  if (clickable && id) {
    return (
      <Link
        href={`/categories/${id}`}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
