/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FlaskConical, Leaf, ArrowRight, Search } from "lucide-react";
import { getDiseases } from "@/lib/api";
import { Disease } from "@/types";

export default function DiseasesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = searchParams.get("search") || "";

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
    return `/diseases${query ? `?${query}` : ""}`;
  };

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setIsLoading(true);
        const data = await getDiseases();
        setDiseases(data as Disease[]);
        setError(null);
      } catch (error) {
        console.error("Error fetching diseases:", error);
        setError("Gagal memuat data penyakit");
        setDiseases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  // Handle form submission
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

  // Filter diseases based on search query if present
  const filteredDiseases = searchQuery
    ? diseases.filter(
        (disease) =>
          disease.disease_nm
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (disease.description &&
            disease.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (disease.symptoms &&
            disease.symptoms.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : diseases;

  // Pagination
  const totalPages = Math.ceil(filteredDiseases.length);
  const validPage = Math.min(Math.max(1), totalPages || 1);
  const start = (validPage - 1) * 10;
  const end = start + 10;
  const paginatedDiseases = filteredDiseases.slice(start, end);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Memuat data penyakit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-red-700 -mx-4 px-4 py-8 md:py-12 md:rounded-xl text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Database Penyakit
          </h1>
          <p className="mb-6 text-red-100">
            Temukan penyakit dan tanaman obat yang dapat mengobatinya
          </p>

          <form onSubmit={handleSearch}>
            <div className="relative w-full max-w-xl mx-auto">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari penyakit..."
                className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search results */}
      {searchQuery && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-700">
            Hasil pencarian untuk:{" "}
            <span className="font-semibold">&quot;{searchQuery}&quot;</span>
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <FlaskConical className="h-12 w-12 text-red-400 mx-auto mb-4" />
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

      {/* Diseases grid */}
      {!error && paginatedDiseases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDiseases.map((disease) => (
            <Link
              key={disease.id}
              href={`/diseases/${disease.id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-red-700" />
                </div>
                <span className="inline-flex items-center text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                  <Leaf className="w-3 h-3 mr-1" />
                  {disease.plants?.length || 0} tanaman
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                {disease.disease_nm}
              </h2>

              {disease.symptoms && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Gejala:
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {disease.symptoms}
                  </p>
                </div>
              )}

              {disease.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {disease.description}
                </p>
              )}

              <div className="flex justify-end">
                <span className="inline-flex items-center text-red-600 text-sm font-medium group-hover:text-red-800">
                  Lihat tanaman obat
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !error && (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Penyakit Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Tidak ada penyakit yang sesuai dengan kriteria pencarian Anda.
            </p>
            <Link
              href="/diseases"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Lihat Semua Penyakit
            </Link>
          </div>
        )
      )}
    </div>
  );
}
