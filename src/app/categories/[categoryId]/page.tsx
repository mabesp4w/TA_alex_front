/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Grid, Leaf } from "lucide-react";
import { getPlantCategoryById, getMedicinalPlantsByCategory } from "@/lib/api";
import PlantCard from "@/components/ui/PlantCard";

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState(null);

  const sortParam = searchParams.get("sort") || "plant_nm";
  const pageParam = parseInt(searchParams.get("page") || "1");
  const perPage = 12;

  // Fungsi untuk membuat URL dengan parameter
  const createUrl = (newParams) => {
    const categoryId = params.categoryId;
    const urlParams = new URLSearchParams();

    // Tambahkan parameter yang ada
    for (const [key, value] of searchParams.entries()) {
      if (!(key in newParams)) {
        urlParams.append(key, value);
      }
    }

    // Tambahkan/perbarui parameter baru
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlParams.set(key, value.toString());
      } else {
        urlParams.delete(key);
      }
    });

    const query = urlParams.toString();
    return `/categories/${categoryId}${query ? `?${query}` : ""}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categoryId = parseInt(params.categoryId);

        if (isNaN(categoryId)) {
          throw new Error("ID kategori tidak valid");
        }

        // Fetch data secara paralel
        const [categoryData, plantsData] = await Promise.all([
          getPlantCategoryById(categoryId),
          getMedicinalPlantsByCategory(categoryId),
        ]);

        setCategory(categoryData);
        setPlants(plantsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError(error.message || "Terjadi kesalahan saat mengambil data");

        // Arahkan ke halaman 404 jika error
        if (error.message === "Category not found" || error.status === 404) {
          router.push("/404");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.categoryId, router]);

  // Urutkan tanaman berdasarkan parameter sort
  const sortedPlants = [...plants].sort((a, b) => {
    if (sortParam === "plant_nm") {
      return a.plant_nm.localeCompare(b.plant_nm);
    } else if (sortParam === "-plant_nm") {
      return b.plant_nm.localeCompare(a.plant_nm);
    } else if (sortParam === "-updated_at") {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
    return 0;
  });

  // Paginasi
  const totalPlants = sortedPlants.length;
  const totalPages = Math.ceil(totalPlants / perPage);
  const currentPage = Math.min(Math.max(1, pageParam), totalPages || 1);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paginatedPlants = sortedPlants.slice(start, end);

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
                  {totalPlants} tanaman dalam kategori ini
                </span>
              </div>
            </div>
          </div>

          {category.description && (
            <p className="text-teal-100 md:max-w-2xl">{category.description}</p>
          )}
        </div>
      </div>

      {/* Sort options */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Tanaman dalam Kategori Ini</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Urutkan:</span>

            <Link
              href={createUrl({ sort: "plant_nm" })}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                sortParam === "plant_nm"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Nama (A-Z)
            </Link>

            <Link
              href={createUrl({ sort: "-plant_nm" })}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                sortParam === "-plant_nm"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Nama (Z-A)
            </Link>

            <Link
              href={createUrl({ sort: "-updated_at" })}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                sortParam === "-updated_at"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Terbaru
            </Link>
          </div>
        </div>
      </div>

      {/* Plants grid */}
      {paginatedPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              id={plant.id}
              plant_nm={plant.plant_nm}
              latin_nm={plant.latin_nm}
              description={plant.description}
              image={plant.image}
              updated_at={plant.updated_at}
              has3dModel={plant.models_3d && plant.models_3d.length > 0}
              categories={
                plant.categories?.map((cat) => ({
                  id: cat.id,
                  category_nm: cat.category_nm,
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Link
              href={createUrl({ page: Math.max(1, currentPage - 1) })}
              className={`px-3 py-1 rounded-md border ${
                currentPage <= 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              aria-disabled={currentPage <= 1}
              onClick={(e) => {
                if (currentPage <= 1) e.preventDefault();
              }}
            >
              Sebelumnya
            </Link>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={i}
                  href={createUrl({ page: pageNum })}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    pageNum === currentPage
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {totalPages > 5 && <span className="text-gray-500">...</span>}

            <Link
              href={createUrl({ page: Math.min(totalPages, currentPage + 1) })}
              className={`px-3 py-1 rounded-md border ${
                currentPage >= totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              aria-disabled={currentPage >= totalPages}
              onClick={(e) => {
                if (currentPage >= totalPages) e.preventDefault();
              }}
            >
              Selanjutnya
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
