/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, FlaskConical, Leaf, Info, BookText } from "lucide-react";
import { getDiseaseById, getMedicinalPlantsByDisease } from "@/lib/api";

export default function DiseaseDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [disease, setDisease] = useState(null);
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const diseaseId = parseInt(params.diseaseId);

        if (isNaN(diseaseId)) {
          throw new Error("ID penyakit tidak valid");
        }

        // Fetch data secara paralel
        const [diseaseData, plantsData] = await Promise.all([
          getDiseaseById(diseaseId),
          getMedicinalPlantsByDisease(diseaseId).catch(() => []),
        ]);

        setDisease(diseaseData);
        setPlants(plantsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching disease details:", error);
        setError(error.message || "Terjadi kesalahan saat mengambil data");

        // Redirect ke halaman 404 jika terjadi error
        if (error.message === "Disease not found" || error.status === 404) {
          router.push("/404");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.diseaseId, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Memuat detail penyakit...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="mb-6">
          <Link
            href="/diseases"
            className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Kembali ke daftar penyakit</span>
          </Link>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/diseases"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Kembali ke Daftar Penyakit
          </Link>
        </div>
      </div>
    );
  }

  // If no disease data is loaded yet
  if (!disease) return null;

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          href="/diseases"
          className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Kembali ke daftar penyakit</span>
        </Link>
      </div>

      {/* Disease header */}
      <div className="bg-red-700 -mx-4 px-4 py-8 md:py-12 md:rounded-xl text-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {disease.disease_nm}
              </h1>
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-1 text-red-200" />
                <span className="text-red-100">
                  {plants.length} tanaman obat untuk penyakit ini
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - col span 2 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="text-xl font-bold">Deskripsi</h2>
            </div>

            <div className="prose max-w-none">
              {disease.description ? (
                <p className="whitespace-pre-line">{disease.description}</p>
              ) : (
                <p className="text-gray-500 italic">Tidak ada deskripsi.</p>
              )}
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <BookText className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="text-xl font-bold">Gejala</h2>
            </div>

            <div className="prose max-w-none">
              {disease.symptoms ? (
                <p className="whitespace-pre-line">{disease.symptoms}</p>
              ) : (
                <p className="text-gray-500 italic">
                  Tidak ada informasi gejala.
                </p>
              )}
            </div>
          </div>

          {/* Plants for this disease */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Tanaman Obat untuk {disease.disease_nm}
            </h2>

            {plants.length > 0 ? (
              <div className="space-y-4">
                {plants.map((plant) => {
                  // Mencari catatan untuk tanaman ini
                  const relation = disease.plant_relations?.find(
                    (rel) => rel.plant_id === plant.id
                  );

                  return (
                    <div
                      key={plant.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Plant image or icon */}
                        <div className="w-16 h-16 bg-teal-100 rounded-lg overflow-hidden flex-shrink-0">
                          {plant.image ? (
                            <Image
                              src={`/api/media/${plant.image}`}
                              alt={plant.plant_nm}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Leaf className="h-8 w-8 text-teal-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <Link
                            href={`/medicinal-plants/${plant.id}`}
                            className="font-bold text-teal-700 hover:text-teal-900 transition-colors"
                          >
                            {plant.plant_nm}
                          </Link>

                          {plant.latin_nm && (
                            <p className="text-sm italic text-gray-600">
                              {plant.latin_nm}
                            </p>
                          )}

                          {relation?.notes && (
                            <div className="mt-2 bg-teal-50 p-3 rounded-md border border-teal-100">
                              <p className="text-sm text-teal-800">
                                <span className="font-medium">
                                  Catatan penggunaan:
                                </span>{" "}
                                {relation.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          <Link
                            href={`/medicinal-plants/${plant.id}`}
                            className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Belum ada tanaman obat yang terdaftar untuk penyakit ini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - col span 1 */}
        <div className="lg:col-span-1 space-y-6">
          {/* Alternative treatments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Penanganan Umum</h3>
            <div className="prose prose-sm">
              <p className="text-gray-700">
                Saat mengalami gejala {disease.disease_nm}, disarankan untuk:
              </p>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li>Konsultasi dengan dokter untuk diagnosis yang tepat</li>
                <li>Istirahat yang cukup</li>
                <li>Minum air putih yang cukup</li>
                <li>Menjaga pola makan sehat</li>
                <li>Menggunakan obat sesuai anjuran dokter</li>
              </ul>
              <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Penting:</strong> Informasi ini tidak menggantikan
                  konsultasi medis. Selalu konsultasikan dengan profesional
                  kesehatan sebelum menggunakan tanaman obat.
                </p>
              </div>
            </div>
          </div>

          {/* Related diseases */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Penyakit Terkait</h3>
            <div className="space-y-3">
              {/* Dummy related diseases - in a real app, these would be fetched from the API */}
              {[1, 2, 3].map((i) => (
                <Link
                  key={i}
                  href={`/diseases/${i}`}
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <FlaskConical className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Penyakit Terkait {i}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
