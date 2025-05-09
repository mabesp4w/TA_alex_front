/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPlantCategories } from "@/lib/api";
import { Grid, Leaf, ArrowRight } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import { useSearchParams, useRouter } from "next/navigation";
import { PlantCategory } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getPlantCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query if present
  const filteredCategories = search
    ? categories.filter((category) =>
        category.category_nm.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;

    if (searchQuery) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/categories");
    }
  };

  return (
    <div className="space-y-8 h-full">
      <div className="bg-teal-700 -mx-4 px-4 py-8 md:py-12 md:rounded-xl text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Kategori Tanaman Obat
          </h1>
          <p className="mb-6 text-teal-100">
            Telusuri tanaman obat berdasarkan kategori
          </p>

          <form onSubmit={handleSearch}>
            <SearchBar placeholder="Cari kategori tanaman..." />
          </form>
        </div>
      </div>

      {/* Search results */}
      {search && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-700">
            Hasil pencarian untuk:{" "}
            <span className="font-semibold">&quot;{search}&quot;</span>
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 mx-auto border-4 border-teal-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Memuat kategori...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Grid className="w-6 h-6 text-teal-700" />
                </div>
                <span className="inline-flex items-center text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  <Leaf className="w-3 h-3 mr-1" />
                  {category.plants?.length || 0} tanaman
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                {category.category_nm}
              </h2>

              {category.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {category.description}
                </p>
              )}

              <div className="flex justify-end">
                <span className="inline-flex items-center text-teal-600 text-sm font-medium group-hover:text-teal-800">
                  Lihat tanaman
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <Grid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Kategori Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            Tidak ada kategori yang sesuai dengan kriteria pencarian Anda.
          </p>
          <Link href="/categories" className="btn-primary">
            Lihat Semua Kategori
          </Link>
        </div>
      )}
    </div>
  );
}
