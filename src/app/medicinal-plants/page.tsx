/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMedicinalPlants, getPlantCategories } from "@/lib/api";
import PlantCard from "@/components/ui/PlantCard";
import { Leaf, Filter, SortAsc, Search } from "lucide-react";
import Link from "next/link";
import { MedicinalPlant, PlantCategory } from "@/types";

export default function MedicinalPlantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plants, setPlants] = useState<MedicinalPlant[]>([]);
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mendapatkan parameter dari URL
  const searchQuery = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "plant_nm";

  // Fungsi untuk membuat URL dengan parameter
  const createUrl = (newParams: any) => {
    const urlParams = new URLSearchParams();

    // Tambahkan parameter yang ada
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
    return `/medicinal-plants${query ? `?${query}` : ""}`;
  };

  // Menangani submit form pencarian
  const handleSearch = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get("search");

    router.push(
      createUrl({
        search: searchQuery || null,
      })
    );
  };

  // Mengambil data saat komponen dimuat atau parameter berubah
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Siapkan parameter untuk API
        const apiParams = {
          search: searchQuery,
          category: categoryId,
          sort: sortParam,
        };

        // Fetch data secara paralel
        const [plantsData, categoriesData] = await Promise.all([
          getMedicinalPlants(apiParams),
          getPlantCategories(),
        ]);

        setPlants(plantsData as MedicinalPlant[]);
        setCategories(categoriesData as PlantCategory[]);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, categoryId, sortParam]);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-teal-700 -mx-4 px-4 py-8 md:py-12 md:rounded-xl text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Database Tanaman Obat
          </h1>
          <p className="mb-6 text-teal-100">
            Temukan berbagai jenis tanaman obat beserta manfaat dan informasi
            lengkapnya
          </p>

          <form onSubmit={handleSearch}>
            <div className="relative w-full max-w-2xl mx-auto">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari tanaman obat berdasarkan nama atau manfaat..."
                className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-primary"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-1 hover:bg-teal-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 mx-auto border-4 border-teal-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Memuat data tanaman...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Filter dan Sorting */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              {/* Filter by category */}
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4" />
                  <h3 className="font-medium text-primary">Filter Kategori</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={createUrl({ category: null })}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      !categoryId
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Semua
                  </Link>

                  {categories.slice(0, 10).map((category: PlantCategory) => (
                    <Link
                      key={category.id}
                      href={createUrl({ category: category.id, page: "1" })}
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        categoryId === category.id.toString()
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {category.category_nm}
                    </Link>
                  ))}

                  {categories.length > 10 && (
                    <Link
                      href="/categories"
                      className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    >
                      Lihat semua
                    </Link>
                  )}
                </div>
              </div>

              {/* Sort options */}
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <SortAsc className="h-4 w-4" />
                  <h3 className="font-medium text-primary">Urutkan</h3>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={createUrl({ sort: "plant_nm" })}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      sortParam === "plant_nm" || !sortParam
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
          </div>

          {/* Hasil Pencarian */}
          {searchQuery && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-700">
                Hasil pencarian untuk:{" "}
                <span className="font-semibold">&quot;{searchQuery}&quot;</span>
              </p>
            </div>
          )}

          {/* Daftar Tanaman */}
          {plants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant: any) => (
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
                    plant.categories?.map((cat: any) => ({
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
                Tanaman Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-4">
                Tidak ada tanaman obat yang sesuai dengan kriteria pencarian
                Anda.
              </p>
              <Link href="/medicinal-plants" className="btn-primary">
                Lihat Semua Tanaman
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
