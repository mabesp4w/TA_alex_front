/** @format */

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import BasicThreeViewer dengan dynamic import
const BasicThreeViewer = dynamic(() => import("./BasicThreeViewer"), {
  ssr: false,
  loading: () => null, // Tidak menampilkan loading indicator
});

interface Plant3DViewerProps {
  modelUrl: string | null;
  plantName: string;
  isVisible: boolean;
  onClose: () => void;
}

const Plant3DViewer: React.FC<Plant3DViewerProps> = ({
  modelUrl,
  isVisible,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);

  useEffect(() => {
    // Deteksi browser dengan try-catch
    try {
      if (typeof window !== "undefined") {
        // Cek apakah WebGL tersedia
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl) {
          console.error("WebGL tidak didukung oleh browser");
          setHasError(true);
        } else {
          setMounted(true);
        }
      }
    } catch (e) {
      console.error("Error saat memeriksa dukungan browser:", e);
      setHasError(true);
    }
  }, []);

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
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Hanya tampilkan viewer saja tanpa UI tambahan
  return (
    <div className="fixed inset-0 z-50">
      <div className="w-full h-full relative bg-transparent">
        {hasError ? null : !modelUrl ? null : mounted ? ( // Tidak menampilkan pesan error // Tidak menampilkan pesan model tidak tersedia
          <div className="w-full h-full bg-transparent">
            <BasicThreeViewer
              key={viewerKey}
              modelUrl={modelUrl}
              isFullscreen={true}
            />
          </div>
        ) : null}

        {/* Tombol Close yang minimal, hanya tampil saat hover */}
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onClose}
            className="p-1 bg-black bg-opacity-30 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
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
