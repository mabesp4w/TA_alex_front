/** @format */

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { PlantDetailResponse } from "@/types";

// Import BasicThreeViewer dengan dynamic import dan set ssr: false
const BasicThreeViewer = dynamic(() => import("./BasicThreeViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Memuat model 3D...</span>
      </div>
    </div>
  ),
});

interface Plant3DViewerProps {
  modelUrl: string | null;
  plantDetail: PlantDetailResponse | null;
  isVisible: boolean;
  onClose: () => void;
}

// Custom hook untuk mengelola WebGL context sharing
const useWebGLContextManager = () => {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(false);

  // Periksa dukungan WebGL sekali saat komponen mount
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      setIsWebGLAvailable(!!gl);

      // Jika ada gl context, hapus untuk mencegah kebocoran
      if (gl && "getExtension" in gl) {
        const loseContextExt = gl.getExtension("WEBGL_lose_context");
        if (loseContextExt) {
          loseContextExt.loseContext();
        }
      }
    } catch (e) {
      console.error("Error saat memeriksa dukungan WebGL:", e);
      setIsWebGLAvailable(false);
    }
  }, []);

  return { isWebGLAvailable };
};

const Plant3DViewer: React.FC<Plant3DViewerProps> = ({
  modelUrl,
  plantDetail,
  isVisible,
  onClose,
}) => {
  const { isWebGLAvailable } = useWebGLContextManager();
  const [viewerKey, setViewerKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast event bahwa 3D viewer aktif
  // Ini akan digunakan untuk pause classifier jika perlu
  useEffect(() => {
    if (isVisible) {
      // Beri tahu komponen lain bahwa 3D viewer aktif
      window.dispatchEvent(
        new CustomEvent("plant3d-viewer-active", { detail: true })
      );

      // Set loading state
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => {
        clearTimeout(timer);
        // Beri tahu komponen lain bahwa 3D viewer tidak aktif
        window.dispatchEvent(
          new CustomEvent("plant3d-viewer-active", { detail: false })
        );
      };
    }
  }, [isVisible]);

  // Reset viewer saat modelUrl berubah
  useEffect(() => {
    if (modelUrl) {
      setViewerKey((prev) => prev + 1);
    }
  }, [modelUrl]);

  // Handle ESC key untuk close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  // Jika tidak visible, return null untuk unmount komponen 3D sepenuhnya
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-10">
      <div className="w-full h-full relative">
        {!isWebGLAvailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <p className="text-red-600 mb-2">
                Browser Anda tidak mendukung tampilan 3D
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : !modelUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <p className="text-red-600 mb-2">
                Model 3D tidak tersedia untuk tanaman ini
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center text-primary">
                  <Loader2 className="animate-spin mr-2" size={24} />
                  <span>Memuat model 3D...</span>
                </div>
              </div>
            )}

            {/* 3D Viewer */}
            <div className="w-full h-full bg-transparent flex justify-center items-center">
              <div className="w-1/3 h-full">
                <BasicThreeViewer
                  key={viewerKey}
                  modelUrl={modelUrl}
                  isFullscreen={false}
                  isActive={true}
                />
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg shadow-md p-4 w-2/3 grow">
                {/* Nama Tanaman */}
                <h2 className="text-2xl font-semibold text-center text-green-600">
                  {plantDetail?.plant_nm}
                </h2>

                {/* Kategori */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Kategori:
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {plantDetail?.categories.map((category) => (
                      <li key={category.id}>{category.category_nm}</li>
                    ))}
                  </ul>
                </div>

                {/* Bagian Tanaman */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Bagian yang Digunakan:
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {plantDetail?.plant_parts.map((part) => (
                      <li key={part.id}>{part.plant_part_nm}</li>
                    ))}
                  </ul>
                </div>

                {/* Manfaat */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Manfaat:
                  </h3>
                  <p className="text-gray-600">{plantDetail?.benefits}</p>
                </div>

                {/* Penyakit yang Bisa Diatasi */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Penyakit yang Bisa Diatasi:
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {plantDetail?.diseases.map((disease) => (
                      <li key={disease.id}>{disease.disease_nm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tombol Close */}
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center transition-opacity duration-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plant3DViewer;
