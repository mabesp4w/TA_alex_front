/** @format */
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  sendImageForPrediction,
  PredictionResult,
} from "@/services/predictionService";
import {
  Loader2,
  Camera,
  X,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const Prediction: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [expandedResults, setExpandedResults] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memulai kamera
  const startCamera = async () => {
    try {
      setError(null);

      // Hentikan track yang sedang berjalan (jika ada)
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Minta akses kamera dengan constraint minimal
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight },
        },
        audio: false,
      });

      if (!videoRef.current) {
        setError("Video element tidak tersedia");
        return;
      }

      videoRef.current.srcObject = stream;
      setHasPermission(true);
    } catch (err) {
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
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas reference missing");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

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

    try {
      // Convert to base64
      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      // Send for prediction
      await processPrediction(imageData);
    } catch (err) {
      console.error("Error saat mengkonversi canvas ke image:", err);
    }
  };

  // Proses prediksi
  const processPrediction = async (imageData: string) => {
    setIsLoading(true);
    setShowResults(true);

    try {
      const result = await sendImageForPrediction(imageData);
      setPredictionResult(result);
    } catch (error) {
      console.error("Error during prediction:", error);
      setPredictionResult({
        success: false,
        class_id: "-1",
        class_name: "Error",
        confidence: 0,
        error: "Terjadi kesalahan saat melakukan prediksi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle capture mode
  const toggleCaptureMode = () => {
    if (isCapturing) {
      setIsCapturing(false);
    } else {
      setIsCapturing(true);
      // Reset results when starting capture
      setPredictionResult(null);
      setShowResults(false);
    }
  };

  // Capture otomatis setiap 3 detik saat isCapturing true
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isCapturing && hasPermission) {
      // Langsung ambil gambar saat mode capture dimulai
      captureImage();

      // Set interval untuk pengambilan otomatis
      intervalId = setInterval(captureImage, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCapturing, hasPermission]);

  // Format confidence sebagai persentase
  const formatConfidence = (confidence: number): string => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Kamera fullscreen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: hasPermission ? "block" : "none" }}
      />

      {/* Loading state */}
      {!hasPermission && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <Camera size={48} className="text-white mb-2 animate-pulse" />
          <p className="text-white">Memuat kamera...</p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-4">
          <div className="bg-red-900 bg-opacity-80 p-4 rounded-lg max-w-md">
            <p className="text-white font-bold mb-2">Error:</p>
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Canvas untuk capture (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hasil prediksi di bagian atas */}
      {hasPermission && showResults && (
        <div
          className={`absolute top-0 left-0 right-0 bg-black bg-opacity-80 transition-all duration-300 ease-in-out ${
            expandedResults ? "max-h-96" : "max-h-32"
          } overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white font-bold text-xl">Hasil Prediksi</h2>
              <button
                onClick={() => setExpandedResults(!expandedResults)}
                className="text-white"
              >
                {expandedResults ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center text-white">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>Memproses...</span>
              </div>
            ) : predictionResult ? (
              <div className="text-white">
                <div className="flex items-center">
                  <div
                    className={`text-xl font-bold ${
                      predictionResult.success
                        ? "text-green-400"
                        : "text-red-400"
                    } mr-2`}
                  >
                    {predictionResult.class_name}
                  </div>
                  {predictionResult.success && (
                    <div className="text-gray-300 text-sm">
                      ({formatConfidence(predictionResult.confidence)})
                    </div>
                  )}
                </div>

                {predictionResult.success &&
                  expandedResults &&
                  predictionResult.all_predictions && (
                    <div className="mt-4">
                      <h3 className="text-gray-300 text-sm mb-2">
                        Semua Prediksi:
                      </h3>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                        {predictionResult.all_predictions.map((pred, index) => (
                          <div
                            key={index}
                            className={`flex justify-between items-center py-1 px-2 rounded ${
                              index === 0
                                ? "bg-green-900 bg-opacity-50"
                                : "bg-gray-800 bg-opacity-50"
                            }`}
                          >
                            <span className="text-sm">{pred.class_name}</span>
                            <span className="text-xs text-gray-400">
                              {pred.probability.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {!predictionResult.success && (
                  <div className="text-red-400 text-sm">
                    {predictionResult.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">Belum ada hasil prediksi</div>
            )}
          </div>
        </div>
      )}

      {/* Tombol kontrol di bagian bawah */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button
          onClick={toggleCaptureMode}
          className={`rounded-full p-4 shadow-lg ${
            isCapturing ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isCapturing ? <X size={32} /> : <Camera size={32} />}
        </button>
      </div>

      {/* Status label */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <div className="text-white text-xs bg-black bg-opacity-50 inline-block px-3 py-1 rounded-full">
          {isCapturing ? "Prediksi otomatis aktif" : "Tap untuk mulai prediksi"}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
