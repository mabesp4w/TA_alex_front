/** @format */

import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  ArrowLeft,
  Clock,
  Info,
  Pill,
  BookOpen,
  CurlyBraces,
  FlaskConical,
} from "lucide-react";
import { notFound } from "next/navigation";
import ModelViewer from "@/components/3d/ModelViewer";
import CategoryBadge from "@/components/ui/CategoryBadge";
import PlantPartBadge from "@/components/ui/PlantPartBadge";
import { getMedicinalPlantById, getPlant3DModels } from "@/lib/api";
import moment from "moment";
import "moment/locale/id";

type PlantDetailPageProps = {
  params: {
    plantId: string;
  };
};

export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  moment.locale("id");

  try {
    // Mengambil data tanaman berdasarkan ID
    const plantId = parseInt(params.plantId);
    const plant = await getMedicinalPlantById(plantId);

    // Mengambil data model 3D jika ada
    const models3D = await getPlant3DModels(plantId).catch(() => []);

    // Mendapatkan model 3D default jika ada
    const defaultModel =
      models3D.find((model) => model.is_default) || models3D[0];

    return (
      <div>
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/medicinal-plants"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Kembali ke daftar tanaman</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - col span 2 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plant header info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Plant image */}
                <div className="md:w-1/3">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                    {plant.image ? (
                      <Image
                        src={`/api/media/${plant.image}`}
                        alt={plant.plant_nm}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Plant info */}
                <div className="md:w-2/3">
                  <h1 className="text-3xl font-bold text-teal-800 mb-1">
                    {plant.plant_nm}
                  </h1>

                  {plant.latin_nm && (
                    <p className="text-lg italic text-gray-600 mb-4">
                      {plant.latin_nm}
                    </p>
                  )}

                  {/* Updated date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Diperbarui:{" "}
                      {moment(plant.updated_at).format("DD MMMM YYYY")}
                    </span>
                  </div>

                  {/* Categories */}
                  {plant.categories && plant.categories.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Kategori:</p>
                      <div className="flex flex-wrap gap-2">
                        {plant.categories.map((category) => (
                          <CategoryBadge
                            key={category.id}
                            name={category.category_nm}
                            id={category.id}
                            clickable
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plant parts */}
                  {plant.parts && plant.parts.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">
                        Bagian yang digunakan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plant.parts.map((part) => (
                          <PlantPartBadge
                            key={part.id}
                            name={part.plant_part_nm}
                            id={part.id}
                            clickable
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3D model badge */}
                  {models3D.length > 0 && (
                    <div className="mt-4">
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                        <CurlyBraces className="h-4 w-4 mr-1" />
                        {models3D.length} Model 3D Tersedia
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Plant description */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-teal-600 mr-2" />
                <h2 className="text-xl font-bold">Deskripsi</h2>
              </div>

              <div className="prose max-w-none">
                {plant.description ? (
                  <p className="whitespace-pre-line">{plant.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Tidak ada deskripsi.</p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Pill className="h-5 w-5 text-teal-600 mr-2" />
                <h2 className="text-xl font-bold">Manfaat</h2>
              </div>

              <div className="prose max-w-none">
                <div className="whitespace-pre-line">{plant.benefits}</div>
              </div>
            </div>

            {/* Usage method */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-teal-600 mr-2" />
                <h2 className="text-xl font-bold">Cara Penggunaan</h2>
              </div>

              <div className="prose max-w-none">
                {plant.usage_method ? (
                  <div className="whitespace-pre-line">
                    {plant.usage_method}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Tidak ada informasi cara penggunaan.
                  </p>
                )}
              </div>
            </div>

            {/* Diseases section */}
            {plant.diseases && plant.diseases.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FlaskConical className="h-5 w-5 text-teal-600 mr-2" />
                  <h2 className="text-xl font-bold">
                    Penyakit yang Dapat Diobati
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plant.diseases.map((disease) => {
                    // Mencari catatan untuk penyakit ini
                    const relation = plant.disease_relations?.find(
                      (rel) => rel.disease_id === disease.id
                    );

                    return (
                      <div
                        key={disease.id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <Link
                          href={`/diseases/${disease.id}`}
                          className="font-medium text-teal-700 hover:text-teal-900 transition-colors"
                        >
                          {disease.disease_nm}
                        </Link>

                        {relation?.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            {relation.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - col span 1 */}
          <div className="space-y-6">
            {/* 3D Model Viewer */}
            {defaultModel && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-3">Model 3D Tanaman</h3>
                <ModelViewer
                  modelUrl={`/api/media/${defaultModel.model_file}`}
                  title={defaultModel.title}
                />

                {models3D.length > 1 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Model 3D Lainnya:
                    </h4>
                    <div className="space-y-2">
                      {models3D
                        .filter((model) => model.id !== defaultModel.id)
                        .map((model) => (
                          <Link
                            key={model.id}
                            href={`/3d-models/${model.id}`}
                            className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <Cube className="h-5 w-5 text-blue-500 mr-2" />
                              <div>
                                <h5 className="font-medium">{model.title}</h5>
                                <p className="text-xs text-gray-500">
                                  {model.file_size
                                    ? `${(
                                        model.file_size /
                                        (1024 * 1024)
                                      ).toFixed(2)} MB`
                                    : "Ukuran tidak tersedia"}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Related plants */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3">Tanaman Terkait</h3>
              <p className="text-sm text-gray-500 mb-4">
                Tanaman lain dengan kategori atau manfaat serupa:
              </p>

              <div className="space-y-3">
                {/* Dummy related plants - in a real application, these would be fetched from the API */}
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    href={`/medicinal-plants/${i}`}
                    className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <Leaf className="h-5 w-5 text-teal-500 mr-2" />
                      <div>
                        <h5 className="font-medium">Tanaman Terkait {i}</h5>
                        <p className="text-xs text-gray-500">
                          Contoh kategori yang sama
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching plant:", error);
    notFound();
  }
}
