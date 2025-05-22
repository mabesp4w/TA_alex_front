/** @format */

import Image from "next/image";
import Link from "next/link";
import { Leaf, Info, CurlyBraces } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import CategoryBadge from "./CategoryBadge";

// Type untuk props dari PlantCard
type PlantCardProps = {
  id: number;
  plant_nm: string;
  latin_nm: string | null;
  description: string | null;
  image: string | null;
  updated_at: string;
  has3dModel: boolean;
  categories: Array<{ id: number; category_nm: string }>;
};

export default function PlantCard({
  id,
  plant_nm,
  latin_nm,
  description,
  image,
  updated_at,
  has3dModel,
  categories,
}: PlantCardProps) {
  moment.locale("id");
  const formattedDate = moment(updated_at).format("DD MMMM YYYY");

  // Potong deskripsi jika terlalu panjang
  const truncatedDescription = description
    ? description.length > 150
      ? description.substring(0, 150) + "..."
      : description
    : "Tidak ada deskripsi.";

  console.log({ plant_nm });

  return (
    <div className="card group">
      <div className="aspect-w-16 aspect-h-9 relative">
        {image ? (
          <Image src={image} alt={plant_nm} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Leaf className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* 3D Model badge if available */}
        {has3dModel && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
            <CurlyBraces className="h-3 w-3 mr-1" />
            Model 3D
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-teal-800 mb-1">{plant_nm}</h3>

        {latin_nm && (
          <p className="text-sm italic text-gray-600 mb-2">{latin_nm}</p>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.slice(0, 3).map((category) => (
              <CategoryBadge key={category.id} name={category.category_nm} />
            ))}
            {categories.length > 3 && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                +{categories.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="text-sm text-gray-700 mb-3">{truncatedDescription}</p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Diperbarui: {formattedDate}
          </span>

          <Link
            href={`/medicinal-plants/${id}`}
            className="btn-primary text-sm flex items-center"
          >
            <Info className="h-4 w-4 mr-1" />
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
