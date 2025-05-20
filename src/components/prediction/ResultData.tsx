/** @format */
"use client";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
  CurlyBraces,
} from "lucide-react";
import { PredictionResult } from "@/types";
import { usePlantStore } from "@/store/plantStore";
import Plant3DViewer from "./Plant3DViewer";

interface ResultDataProps {
  predictions: PredictionResult[];
  isPredicting: boolean;
}

const ResultData = ({ predictions, isPredicting }: ResultDataProps) => {
  // state
  const [showAllResults, setShowAllResults] = useState(false);
  const [model3d, setModel3d] = useState<string | null>(null);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedPlantName, setSelectedPlantName] = useState<string>("");

  const { isLoading, error, fetchPlantDetail, clearError, plantDetail } =
    usePlantStore();

  // Handle fetch plant detail
  const handleShowData = async (plantName: string) => {
    await fetchPlantDetail(plantName);
    setSelectedPlantName(plantName);
  };

  // Handle show 3D viewer
  const handleShow3D = () => {
    if (model3d) {
      setShow3DViewer(true);
    }
  };

  // Handle close 3D viewer
  const handleClose3D = () => {
    setShow3DViewer(false);
  };

  useEffect(() => {
    if (plantDetail) {
      const model3d = plantDetail.models_3d?.[0]?.model_file;
      if (model3d) {
        setModel3d(model3d);
      } else {
        setModel3d(null);
      }
    }
  }, [plantDetail]);

  if (!isPredicting || predictions.length === 0) {
    return null;
  }

  const topPrediction = predictions[0];
  const shouldShowButton = topPrediction.probability > 0.5;

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

          {/* Action Buttons */}
          {shouldShowButton && topPrediction.class !== "Bukan Tanaman" && (
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

              {/* Show 3D Button - hanya tampil jika ada model3d */}
              {model3d && (
                <button
                  onClick={handleShow3D}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <CurlyBraces className="mr-2" size={16} />
                  Lihat Model 3D
                </button>
              )}

              {/* Info jika tidak ada model 3D */}
              {plantDetail && !model3d && (
                <div className="text-xs text-gray-500 text-center mt-2">
                  Model 3D tidak tersedia untuk tanaman ini
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
        plantName={selectedPlantName}
        isVisible={show3DViewer}
        onClose={handleClose3D}
      />
    </>
  );
};

export default ResultData;
