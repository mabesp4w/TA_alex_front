/** @format */

import { getMedicinalPlants, getPlantCategories } from "@/lib/api";
import PlantCard from "@/components/ui/PlantCard";
import SearchBar from "@/components/ui/SearchBar";
import { Leaf, Filter, SortAsc } from "lucide-react";
import Link from "next/link";

// Menangani parameter untuk halaman ini
type MedicinalPlantsPageProps = {
  searchParams: {
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  };
};

export default async function MedicinalPlantsPage({
  searchParams,
}: MedicinalPlantsPageProps) {
  // Siapkan parameter untuk API
  const apiParams = {
    search: searchParams.search || "",
    category: searchParams.category || "",
    sort: searchParams.sort || "plant_nm",
    page: parseInt(searchParams.page || "1"),
    per_page: 12,
  };

  // Fetch data
  const [plants, categories] = await Promise.all([
    getMedicinalPlants(apiParams).catch(() => []),
    getPlantCategories().catch(() => []),
  ]);

  // Buat paginasi sederhana
  const totalPlants = 100; // Idealnya ini didapatkan dari API
  const totalPages = Math.ceil(totalPlants / apiParams.per_page);
  const currentPage = apiParams.page;

  return (
    <div className="space-y-8">
      <div className="bg-teal-700 -mx-4 px-4 py-8 md:py-12 md:rounded-xl text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Database Tanaman Obat
          </h1>
          <p className="mb-6 text-teal-100">
            Temukan berbagai jenis tanaman obat beserta manfaat dan informasi
            lengkapnya
          </p>

          <SearchBar placeholder="Cari tanaman obat berdasarkan nama atau manfaat..." />
        </div>
      </div>

      {/* Filter dan Sorting */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {/* Filter by category */}
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              <h3 className="font-medium">Filter Kategori</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/medicinal-plants"
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  !searchParams.category
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Semua
              </Link>

              {categories.slice(0, 10).map((category) => (
                <Link
                  key={category.id}
                  href={`/medicinal-plants?category=${category.id}`}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    searchParams.category === category.id.toString()
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
              <h3 className="font-medium">Urutkan</h3>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/medicinal-plants?${new URLSearchParams({
                  ...searchParams,
                  sort: "plant_nm",
                }).toString()}`}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  searchParams.sort === "plant_nm" || !searchParams.sort
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Nama (A-Z)
              </Link>

              <Link
                href={`/medicinal-plants?${new URLSearchParams({
                  ...searchParams,
                  sort: "-plant_nm",
                }).toString()}`}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  searchParams.sort === "-plant_nm"
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Nama (Z-A)
              </Link>

              <Link
                href={`/medicinal-plants?${new URLSearchParams({
                  ...searchParams,
                  sort: "-updated_at",
                }).toString()}`}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  searchParams.sort === "-updated_at"
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
      {searchParams.search && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-700">
            Hasil pencarian untuk:{" "}
            <span className="font-semibold">
              &quot;{searchParams.search}&quot;
            </span>
          </p>
        </div>
      )}

      {/* Daftar Tanaman */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
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
            Tanaman Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            Tidak ada tanaman obat yang sesuai dengan kriteria pencarian Anda.
          </p>
          <Link href="/medicinal-plants" className="btn-primary">
            Lihat Semua Tanaman
          </Link>
        </div>
      )}

      {/* Pagination */}
      {plants.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Link
              href={`/medicinal-plants?${new URLSearchParams({
                ...searchParams,
                page: Math.max(1, currentPage - 1).toString(),
              }).toString()}`}
              className={`px-3 py-1 rounded-md border ${
                currentPage <= 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              aria-disabled={currentPage <= 1}
            >
              Sebelumnya
            </Link>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={i}
                  href={`/medicinal-plants?${new URLSearchParams({
                    ...searchParams,
                    page: pageNum.toString(),
                  }).toString()}`}
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
              href={`/medicinal-plants?${new URLSearchParams({
                ...searchParams,
                page: Math.min(totalPages, currentPage + 1).toString(),
              }).toString()}`}
              className={`px-3 py-1 rounded-md border ${
                currentPage >= totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              aria-disabled={currentPage >= totalPages}
            >
              Selanjutnya
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
