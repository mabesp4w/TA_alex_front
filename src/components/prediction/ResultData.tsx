/** @format */
"use client";
import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Loader2, Info } from "lucide-react";
import { PredictionResult } from "@/types";
import { usePlantStore } from "@/store/plantStore";
import { BASE_URL } from "@/services/baseURL";
import Plant3DViewer from "./Plant3DViewer";

interface ResultDataProps {
  predictions: PredictionResult[];
  isPredicting: boolean;
  onToggleClassifier?: (active: boolean) => void;
}

const ResultData = ({
  predictions,
  isPredicting,
  onToggleClassifier,
}: ResultDataProps) => {
  // state
  const [showAllResults, setShowAllResults] = useState(false);
  const [model3d, setModel3d] = useState<string | null>(null);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedPlantName, setSelectedPlantName] = useState<string>("");
  const [loading3DModel, setLoading3DModel] = useState(false);
  const [manuallyTriggered, setManuallyTriggered] = useState(false);

  const { isLoading, error, fetchPlantDetail, clearError, plantDetail } =
    usePlantStore();

  // Handle close 3D viewer - cleanup WebGL context
  const handleClose3D = useCallback(() => {
    setShow3DViewer(false);
    setManuallyTriggered(false);
    // Beri tahu parent untuk mengaktifkan classifier kembali
    if (onToggleClassifier) {
      onToggleClassifier(true);
    }
  }, [onToggleClassifier]);

  // Listen untuk plant3d-viewer-active event
  useEffect(() => {
    const handleViewerActive = (event: CustomEvent) => {
      // Jika 3D viewer active, nonaktifkan classifier
      if (onToggleClassifier) {
        onToggleClassifier(!event.detail);
      }
    };

    window.addEventListener(
      "plant3d-viewer-active",
      handleViewerActive as EventListener
    );

    return () => {
      window.removeEventListener(
        "plant3d-viewer-active",
        handleViewerActive as EventListener
      );
    };
  }, [onToggleClassifier]);

  // Efek untuk memantau apakah tombol "Tampilkan Data" masih tersedia
  useEffect(() => {
    const topPrediction = predictions[0];
    const shouldShowButton =
      topPrediction &&
      topPrediction.probability > 0.6 &&
      topPrediction.class !== "Bukan Tanaman";

    // Jika tombol tidak ada lagi tetapi viewer masih terbuka
    if (!shouldShowButton && show3DViewer && manuallyTriggered) {
      handleClose3D();
    }

    // Jika prediksi berubah dan nama tanaman berubah, tutup viewer
    if (
      manuallyTriggered &&
      selectedPlantName &&
      topPrediction &&
      topPrediction.class !== selectedPlantName
    ) {
      handleClose3D();
    }
  }, [
    predictions,
    show3DViewer,
    manuallyTriggered,
    selectedPlantName,
    handleClose3D,
  ]);

  // Set model 3D dan tampilkan viewer jika data tersedia dan dipicu secara manual
  useEffect(() => {
    if (plantDetail && manuallyTriggered) {
      const model3dFile = plantDetail.models_3d?.[0]?.model_file;
      if (model3dFile) {
        setModel3d(`${BASE_URL}${model3dFile}`);
        setShow3DViewer(true);
      } else {
        setModel3d(null);
        setShow3DViewer(false);
        // Aktifkan kembali classifier karena tidak ada model 3D
        if (onToggleClassifier) {
          onToggleClassifier(true);
        }
      }
      setLoading3DModel(false);
    }
  }, [plantDetail, onToggleClassifier, manuallyTriggered]);

  // Handle fetch plant detail (untuk tombol Tampilkan Data)
  const handleShowData = async (plantName: string) => {
    // Nonaktifkan classifier selama memuat model 3D
    if (onToggleClassifier) {
      onToggleClassifier(false);
    }

    setSelectedPlantName(plantName);
    setLoading3DModel(true);
    setManuallyTriggered(true);

    try {
      await fetchPlantDetail(plantName);
    } catch (err) {
      console.error("Error fetching plant detail:", err);
      // Aktifkan kembali classifier jika terjadi error
      if (onToggleClassifier) {
        onToggleClassifier(true);
      }
      setManuallyTriggered(false);
    }
  };

  if (!isPredicting || predictions.length === 0) {
    return null;
  }

  const topPrediction = predictions[0];
  const shouldShowButton =
    topPrediction.probability > 0.6 && topPrediction.class !== "Bukan Tanaman";

  return (
    <>
      {/* Prediction Results */}
      <div className="absolute top-3 left-3 w-64 md:w-80 bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20">
        {/* Top Result */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-800">
              {topPrediction.class}
            </span>
            <span className="text-blue-600 font-bold">
              {(topPrediction.probability * 100).toFixed(2)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${(topPrediction.probability * 100).toFixed(2)}%`,
              }}
            />
          </div>

          {/* Action Buttons & Notifications */}
          {shouldShowButton && (
            <div className="mt-3 space-y-2">
              {/* Show Data Button */}
              <button
                onClick={() => handleShowData(topPrediction.class)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Memuat...
                  </>
                ) : (
                  <>
                    <Info className="mr-2" size={16} />
                    Tampilkan Data
                  </>
                )}
              </button>

              {/* 3D Model Status Messages */}
              {loading3DModel && (
                <div className="text-sm text-blue-600 text-center mt-2 flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Memuat model 3D...
                </div>
              )}

              {plantDetail &&
                !model3d &&
                !loading3DModel &&
                manuallyTriggered && (
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Model 3D tidak tersedia untuk tanaman ini
                  </div>
                )}

              {plantDetail && model3d && !loading3DModel && show3DViewer && (
                <div className="text-xs text-blue-600 text-center mt-2">
                  Model 3D sedang ditampilkan
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collapsible All Results */}
        {predictions.length > 1 && (
          <div className="border-t pt-3">
            <button
              onClick={() => setShowAllResults(!showAllResults)}
              className="w-full flex items-center justify-between text-sm text-gray-600 font-medium py-2 hover:text-gray-800 transition-colors"
            >
              <span>Lihat Semua Hasil</span>
              {showAllResults ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showAllResults && (
              <div className="mt-2 space-y-3">
                {predictions.slice(1, 5).map((prediction, index) => {
                  const percentage = (prediction.probability * 100).toFixed(2);
                  return (
                    <div key={index} className="pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {prediction.class}
                        </span>
                        <span className="text-sm text-blue-600 font-medium">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-red-600 text-xs underline"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* 3D Viewer Modal */}
      <Plant3DViewer
        modelUrl={model3d}
        plantDetail={plantDetail}
        isVisible={show3DViewer}
        onClose={handleClose3D}
      />
    </>
  );
};

export default ResultData;
