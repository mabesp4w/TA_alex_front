/** @format */
"use client";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/ui/SearchBar";
import { Leaf, Grid, FlaskConical, Cuboid } from "lucide-react";
import { getMedicinalPlants, getPlantCategories, getDiseases } from "@/lib/api";
import { useEffect, useState } from "react";
import { Disease, MedicinalPlant, PlantCategory } from "@/lib/types";

export default function Home() {
  const [plants, setPlants] = useState<MedicinalPlant[]>([]);
  const [categories, setCategories] = useState<PlantCategory[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const plantsData = await getMedicinalPlants({ limit: 6 }).catch(() => []);
      setPlants(plantsData);
    };

    const fetchCategories = async () => {
      const categoriesData = await getPlantCategories().catch(() => []);
      console.log({ categoriesData });
      setCategories(categoriesData);
    };

    const fetchDiseases = async () => {
      const diseasesData = await getDiseases({ limit: 6 }).catch(() => []);
      setDiseases(diseasesData);
    };

    fetchPlants();
    fetchCategories();
    fetchDiseases();
  }, []);

  return (
    <div className="space-y-12 h-full pb-20">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-500 text-white rounded-xl overflow-hidden shadow-xl">
        <div className="container mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 ">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Database Tanaman Obat Indonesia
            </h1>
            <p className="text-lg mb-8 text-teal-100">
              Temukan berbagai tanaman obat asli Indonesia lengkap dengan
              informasi manfaat, cara penggunaan, dan visualisasi model 3D.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/prediction"
                className="bg-white text-teal-700 hover:bg-teal-100 transition-colors px-6 py-3 rounded-full font-bold text-center"
              >
                Deteksi Tanaman Obat
              </Link>
              <Link
                href="/medicinal-plants"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-teal-700 transition-colors px-6 py-3 rounded-full font-bold text-center"
              >
                Eksplorasi Tanaman
              </Link>
            </div>
          </div>
          <div className="hidden md:w-1/2 relative">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/bg/2.png"
                alt="Tanaman Obat Indonesia"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Cari Tanaman Obat
        </h2>
        <SearchBar
          onSubmit={() => {}}
          placeholder="Cari berdasarkan nama tanaman, manfaat, atau kategori..."
        />
      </section>

      {/* Category Section */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Kategori Tanaman</h2>
          <Link
            href="/categories"
            className="text-primary hover:text-primary-focus font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <Grid className="h-8 w-8 text-teal-600 mb-2" />
              <h3 className="font-medium text-neutral">
                {category.category_nm}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {category.plants?.length || 0} tanaman
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Plants */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Tanaman Obat Populer
          </h2>
          <Link
            href="/medicinal-plants"
            className="text-primary hover:text-primary-focus font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Link
              key={plant.id}
              href={`/medicinal-plants/${plant.id}`}
              className="group block bg-white border border-gray-200 hover:border-teal-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                {plant.image ? (
                  <Image
                    src={`${plant.image}`}
                    alt={plant.plant_nm}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-primary" />
                  </div>
                )}

                {plant.models_3d && plant.models_3d.length > 0 && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                    <Cuboid className="h-3 w-3 mr-1" />
                    Model 3D
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-neutral group-hover:text-teal-600 transition-colors">
                  {plant.plant_nm}
                </h3>
                {plant.latin_nm && (
                  <p className="text-sm italic text-gray-600">
                    {plant.latin_nm}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Common Diseases */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Penyakit Umum</h2>
          <Link
            href="/diseases"
            className="text-primary hover:text-primary-focus font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseases.map((disease) => (
            <Link
              key={disease.id}
              href={`/diseases/${disease.id}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <FlaskConical className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-neutral">
                  {disease.disease_nm}
                </h3>
                <p className="text-xs text-gray-500">
                  {disease.plants?.length || 0} tanaman obat
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
