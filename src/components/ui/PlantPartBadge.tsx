/** @format */

import { Scissors } from "lucide-react";
import Link from "next/link";

type PlantPartBadgeProps = {
  name: string;
  id?: number;
  clickable?: boolean;
};

export default function PlantPartBadge({
  name,
  id,
  clickable = false,
}: PlantPartBadgeProps) {
  const content = (
    <div className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
      <Scissors className="h-3 w-3 mr-1" />
      {name}
    </div>
  );

  if (clickable && id) {
    return (
      <Link
        href={`/plant-parts/${id}`}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
