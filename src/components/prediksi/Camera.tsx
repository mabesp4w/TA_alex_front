/** @format */
"use client";
import React, { useRef, useEffect, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";

interface CameraProps {
  onCapture: (imageData: string) => void;
  isCapturing: boolean;
}

const CameraComponent: React.FC<CameraProps> = ({ onCapture, isCapturing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memulai kamera - dibuat sebagai fungsi terpisah agar bisa dipanggil ulang
  const startCamera = async () => {
    try {
      // Reset error state
      setError(null);

      // Hentikan track yang sedang berjalan (jika ada)
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Minta akses kamera dengan constraint minimal
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      // Pastikan video reference ada
      if (!videoRef.current) {
        console.error("Video element tidak tersedia");
        setError("Video element tidak tersedia");
        return;
      }

      // Set stream ke video element
      videoRef.current.srcObject = stream;
      console.log("Camera stream set to video element");

      // Set permission state
      setHasPermission(true);
    } catch (err) {
      console.error("Error saat mengakses kamera:", err);
      setError(
        `Tidak bisa mengakses kamera: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setHasPermission(false);
    }
  };

  // Mulai kamera saat komponen dimount
  useEffect(() => {
    // Panggil fungsi startCamera
    startCamera();

    // Cleanup saat komponen unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Fungsi untuk mengambil gambar dari kamera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas reference missing");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set ukuran canvas ke ukuran video yang sebenarnya
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Cannot get canvas context");
      return;
    }

    // Gambar frame video ke canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Konversi canvas ke base64 (JPEG)
    try {
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      onCapture(imageData);
    } catch (err) {
      console.error("Error saat mengkonversi canvas ke image:", err);
    }
  };

  // Atur interval untuk capture otomatis
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isCapturing && hasPermission) {
      intervalId = setInterval(captureImage, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCapturing, hasPermission, onCapture]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Error message */}
      {error && (
        <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={startCamera}
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-1 px-4 rounded inline-flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Camera display */}
      <div
        className="relative w-full max-w-md rounded-lg overflow-hidden bg-black shadow-lg"
        style={{ minHeight: "320px" }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: hasPermission ? "block" : "none",
          }}
        />

        {/* Loading state */}
        {!hasPermission && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <Camera size={48} className="text-gray-400 mb-2 animate-pulse" />
            <p className="text-gray-500">Memuat kamera...</p>
          </div>
        )}

        {/* Canvas for image capture (hidden) */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Capture button */}
        {hasPermission && !isCapturing && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={captureImage}
              className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-100"
            >
              <Camera size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Capture status */}
      {isCapturing && hasPermission && (
        <div className="mt-3 text-sm bg-green-100 text-green-700 p-2 rounded-md">
          Pengambilan gambar otomatis aktif (setiap 3 detik)
        </div>
      )}

      {/* Debug info */}
      <div className="mt-3 text-xs text-gray-500 w-full max-w-md">
        Status: {hasPermission ? "Kamera aktif" : "Menunggu akses kamera..."}
      </div>
    </div>
  );
};

export default CameraComponent;
