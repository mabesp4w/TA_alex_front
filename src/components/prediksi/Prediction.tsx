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
import PlantModel3D from "./PlantModel3D";
import { BiCube } from "react-icons/bi";

const Prediction: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [previousClassName, setPreviousClassName] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [expandedResults, setExpandedResults] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [continuePrediction, setContinuePrediction] = useState(true);

  // Referensi untuk melacak jika model 3D sedang dimuat
  const isLoadingModel = useRef(false);
  // Referensi untuk mencegah multiple prediksi overlap
  const isPredicting = useRef(false);

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
    // Jika sedang memprediksi, lewati
    if (isPredicting.current) {
      console.log("Prediksi sebelumnya masih berjalan, melewati...");
      return;
    }

    // Jika sedang memuat model 3D, lewati
    if (isLoadingModel.current) {
      console.log("Sedang memuat model 3D, melewati prediksi...");
      return;
    }

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
    // Set flag sedang memprediksi
    isPredicting.current = true;

    setIsLoading(true);
    setShowResults(true);

    try {
      const result = await sendImageForPrediction(imageData);

      // Set hasil prediksi baru
      setPredictionResult(result);

      // Debug logs
      console.log("=== Prediction Debug ===");
      console.log("Prediction result:", result);
      console.log("Previous class:", previousClassName);
      console.log("Current class:", result.class_name);
      console.log("Has plant model?", hasPlantModel(result.class_name));
      console.log("Show 3D model?", show3DModel);
      console.log("=====================");

      // PERBAIKAN: Logika yang disederhanakan - selalu tampilkan jika memenuhi kriteria
      if (
        result.success &&
        result.confidence > 0.75 &&
        hasPlantModel(result.class_name)
      ) {
        console.log("Menampilkan model 3D untuk:", result.class_name);
        isLoadingModel.current = true;
        setShow3DModel(true);
        setPreviousClassName(result.class_name);
        setContinuePrediction(false);
      } else {
        console.log("Menyembunyikan model 3D");
        setShow3DModel(false);
        // Jangan set previousClassName di sini, biarkan null
        setContinuePrediction(true);
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      setPredictionResult({
        success: false,
        class_id: "-1",
        class_name: "Error",
        confidence: 0,
        error: "Terjadi kesalahan saat melakukan prediksi",
      });

      // Jika error, sembunyikan model 3D
      setShow3DModel(false);
      setPreviousClassName(null); // Reset
      setContinuePrediction(true);
    } finally {
      setIsLoading(false);
      // Clear flag predicting
      isPredicting.current = false;
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
      setShow3DModel(false);
      setPreviousClassName(null);
      setContinuePrediction(true);
    }
  };

  // Toggle 3D model visibility
  const toggle3DModel = () => {
    if (show3DModel) {
      setShow3DModel(false);
      setContinuePrediction(true);
      // PERBAIKAN: Reset previousClassName saat model ditutup manual
      setPreviousClassName(null);
    } else if (
      predictionResult?.success &&
      hasPlantModel(predictionResult.class_name)
    ) {
      console.log(
        "Manual toggle 3D model ON for:",
        predictionResult.class_name
      );
      isLoadingModel.current = true;
      setShow3DModel(true);
      setContinuePrediction(false);
    }
  };
  // Mendengarkan event untuk menutup model 3D
  useEffect(() => {
    const handleClose3DModel = () => {
      console.log("Closing 3D model via event");
      setShow3DModel(false);
      setContinuePrediction(true);
      // PERBAIKAN: Reset previousClassName saat model ditutup
      setPreviousClassName(null);
    };

    const handleModelLoaded = () => {
      console.log("Model 3D selesai dimuat");
      isLoadingModel.current = false;
    };

    document.addEventListener("close3dModel", handleClose3DModel);
    document.addEventListener("model3dLoaded", handleModelLoaded);

    return () => {
      document.removeEventListener("close3dModel", handleClose3DModel);
      document.removeEventListener("model3dLoaded", handleModelLoaded);
    };
  }, []);

  // Capture otomatis setiap 3 detik saat isCapturing true
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isCapturing && hasPermission) {
      // Langsung ambil gambar saat mode capture dimulai
      captureImage();

      // Set interval untuk pengambilan otomatis
      intervalId = setInterval(() => {
        // Hanya lanjutkan prediksi jika flag continuePrediction true
        if (continuePrediction) {
          captureImage();
        } else {
          console.log("Prediksi dihentikan sementara - Model 3D aktif");
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCapturing, hasPermission, continuePrediction]);

  // Format confidence sebagai persentase
  const formatConfidence = (confidence: number): string => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  // Cek apakah hasil prediksi adalah tanaman yang memiliki model 3D
  const hasPlantModel = (className?: string) => {
    if (!className) return false;

    const availablePlants = [
      "Daun Kunyit",
      "Daun Kemangi",
      "Daun Pepaya",
      "Daun Sirih",
      "Daun Sirsak",
      "Lidah Buaya",
    ];

    return availablePlants.includes(className);
  };

  // Debugging tambahan untuk melihat perubahan state
  useEffect(() => {
    console.log("=== State Change ===");
    console.log("show3DModel:", show3DModel);
    console.log("previousClassName:", previousClassName);
    console.log("continuePrediction:", continuePrediction);
  }, [show3DModel, previousClassName, continuePrediction]);

  // Debug props yang dikirim ke PlantModel3D
  useEffect(() => {
    console.log("=== Sending Props to PlantModel3D ===");
    console.log("show3DModel:", show3DModel);
    console.log("predictionResult?.success:", predictionResult?.success);
    console.log("predictionResult?.class_name:", predictionResult?.class_name);
    console.log(
      "hasPlantModel:",
      predictionResult?.class_name && hasPlantModel(predictionResult.class_name)
    );

    const plantClassToSend =
      show3DModel &&
      predictionResult?.success &&
      hasPlantModel(predictionResult.class_name)
        ? predictionResult.class_name
        : null;

    console.log("plantClass to send:", plantClassToSend);
    console.log("isVisible to send:", show3DModel);
    console.log("previousClassName:", previousClassName);
  }, [show3DModel, predictionResult?.class_name, previousClassName]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Kamera fullscreen - SELALU TAMPIL */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
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

      {/* 3D Model - Tanpa background hitam */}
      <PlantModel3D
        key={show3DModel ? `model-${predictionResult?.class_name}` : "hidden"}
        plantClass={
          show3DModel &&
          predictionResult?.success &&
          hasPlantModel(predictionResult.class_name)
            ? predictionResult.class_name
            : null
        }
        isVisible={show3DModel}
        currentModelClass={previousClassName}
        transparent={true}
      />

      {/* Canvas untuk capture (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hasil prediksi di bagian atas */}
      {hasPermission && showResults && (
        <div
          className={`absolute top-0 left-0 right-0 bg-black bg-opacity-80 transition-all duration-300 ease-in-out ${
            expandedResults ? "max-h-96" : "max-h-32"
          } overflow-hidden z-10`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white font-bold text-xl">Hasil Prediksi</h2>
              <div className="flex">
                {predictionResult?.success &&
                  hasPlantModel(predictionResult.class_name) && (
                    <button
                      onClick={toggle3DModel}
                      className={`mr-2 p-1 rounded ${
                        show3DModel
                          ? "bg-blue-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                      title={
                        show3DModel
                          ? "Sembunyikan Model 3D"
                          : "Tampilkan Model 3D"
                      }
                      disabled={isLoadingModel.current}
                    >
                      <BiCube size={20} />
                    </button>
                  )}
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
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
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
      <div className="absolute bottom-2 left-0 right-0 text-center z-10">
        <div className="text-white text-xs bg-black bg-opacity-50 inline-block px-3 py-1 rounded-full">
          {show3DModel
            ? "Mode 3D aktif (Prediksi dihentikan)"
            : isCapturing && continuePrediction
            ? "Prediksi otomatis aktif"
            : isCapturing && !continuePrediction
            ? "Prediksi dihentikan sementara"
            : "Tap untuk mulai prediksi"}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
