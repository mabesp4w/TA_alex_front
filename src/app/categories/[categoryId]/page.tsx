/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Grid, Leaf } from "lucide-react";
import { getPlantCategoryById, getMedicinalPlantsByCategory } from "@/lib/api";
import PlantCard from "@/components/ui/PlantCard";
import { PlantCategory } from "@/types";

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<PlantCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categoryId = parseInt(params.categoryId as string);

        if (isNaN(categoryId)) {
          throw new Error("ID kategori tidak valid");
        }

        // Fetch data secara paralel
        const [categoryData] = await Promise.all([
          getPlantCategoryById(categoryId),
          getMedicinalPlantsByCategory(categoryId),
        ]);

        setCategory(categoryData as PlantCategory);
        setError(null);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError((error as string) || "Terjadi kesalahan saat mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.categoryId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-4 border-teal-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Memuat detail kategori...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
        <div className="text-red-500 text-2xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/categories"
          className="btn-primary bg-red-600 hover:bg-red-700"
        >
          Kembali ke Daftar Kategori
        </Link>
      </div>
    );
  }

  if (!category) return null;

  console.log({ category });

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/categories"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Kembali ke daftar kategori</span>
        </Link>
      </div>

      {/* Category header */}
      <div className="bg-teal-700 -mx-4 px-4 py-8 md:py-12 md:rounded-xl text-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Grid className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {category.category_nm}
              </h1>
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-teal-200" />
                <span className="text-teal-100">
                  {category.plants?.length} tanaman dalam kategori ini
                </span>
              </div>
            </div>
          </div>

          {category.description && (
            <p className="text-teal-100 md:max-w-2xl">{category.description}</p>
          )}
        </div>
      </div>
      {/* Plants grid */}
      {category?.plants && category?.plants?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.plants?.map((plant) => (
            <PlantCard
              key={plant.id}
              id={plant.id}
              plant_nm={plant.plant_nm}
              latin_nm={plant.latin_nm || null}
              description={plant.description || null}
              image={plant.image || null}
              updated_at={plant.updated_at}
              has3dModel={false}
              categories={
                category.plants?.map((cat) => ({
                  id: cat.id,
                  category_nm: category.category_nm,
                })) || []
              }
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak Ada Tanaman
          </h3>
          <p className="text-gray-600 mb-4">
            Belum ada tanaman yang terdaftar dalam kategori ini.
          </p>
          <Link href="/medicinal-plants" className="btn-primary">
            Lihat Semua Tanaman
          </Link>
        </div>
      )}
    </div>
  );
}
