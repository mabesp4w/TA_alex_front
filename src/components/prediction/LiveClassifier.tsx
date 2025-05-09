/** @format */
"use client";
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Pause, Play } from "lucide-react";
import Camera from "./Camera";

interface PredictionResult {
  class: string;
  probability: number;
}

const LiveClassifier = () => {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [classLabels, setClassLabels] = useState<Record<string, string>>({});
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  // Default class names if JSON file cannot be loaded
  const DEFAULT_CLASS_NAMES = {
    "0": "Bukan Tanaman",
    "1": "Daun Kemangi",
    "2": "Daun Kunyit",
    "3": "Daun Pepaya",
    "4": "Daun Sirih",
    "5": "Daun Sirsak",
    "6": "Lidah Buaya",
  };

  // Load model when component mounts
  useEffect(() => {
    loadModel();

    // Turn off prediction when component unmounts
    return () => {
      setIsPredicting(false);
    };
  }, []);

  // Ensure full screen layout
  useEffect(() => {
    // Fix for some mobile browsers: ensure properly sized container
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    // Cleanup on unmount
    return () => {
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Load TensorFlow.js model
  const loadModel = async () => {
    try {
      console.log("Loading model...");
      setIsModelLoading(true);

      // Load model
      const loadedModel = await tf.loadGraphModel("/model/model.json");
      setModel(loadedModel);
      console.log("Model loaded successfully!");

      // Try to load class labels
      try {
        const response = await fetch("/model/nama_kelas.json");
        if (response.ok) {
          const labels = await response.json();
          setClassLabels(labels);
          console.log("Class labels loaded:", labels);
        } else {
          console.warn("Failed to load class names JSON, using defaults");
          setClassLabels(DEFAULT_CLASS_NAMES);
        }
      } catch (error) {
        console.warn("Error loading class names:", error);
        setClassLabels(DEFAULT_CLASS_NAMES);
      }
    } catch (error) {
      console.error("Error loading model:", error);
      alert("Failed to load TensorFlow model. Check console for details.");
    } finally {
      setIsModelLoading(false);
    }
  };

  // Toggle prediction state
  const togglePrediction = () => {
    setIsPredicting(!isPredicting);
  };

  // Function to handle frames from the Camera component
  const handleFrame = (canvas: HTMLCanvasElement) => {
    if (!model) return;

    // Process the canvas and get predictions
    analyzeImage(canvas).then((results) => {
      setPredictions(results);
    });
  };

  // Function to process an image and make prediction
  const analyzeImage = async (
    imgElement: HTMLCanvasElement | HTMLImageElement
  ): Promise<PredictionResult[]> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return tf.tidy(() => {
      // Pre-process image for the model
      const img = tf.browser
        .fromPixels(imgElement)
        .resizeBilinear([224, 224]) // MobileNetV2 input size
        .toFloat();

      // Normalize image (MobileNetV2 uses -1 to 1 normalization)
      const normalized = img.div(tf.scalar(127.5)).sub(tf.scalar(1));

      // Add batch dimension
      const batched = normalized.expandDims(0);

      // Make prediction
      const predictions = model!.predict(batched) as tf.Tensor;

      // Get results as JavaScript array
      const predictionArray = predictions.dataSync();

      // Create array for prediction results with class names
      const results: PredictionResult[] = [];

      for (let i = 0; i < predictionArray.length; i++) {
        const className = classLabels[i.toString()] || `Class ${i}`;
        results.push({
          class: className,
          probability: predictionArray[i],
        });
      }

      // Sort by probability (highest first)
      return results.sort((a, b) => b.probability - a.probability);
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {isModelLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="ml-2 text-white">Loading model...</p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          {/* Camera component takes the full height and width */}
          <Camera
            onFrame={handleFrame}
            isCapturing={isPredicting}
            className="w-full h-full"
          />

          {/* Analyzing indicator */}
          {isPredicting && (
            <div className="absolute top-3 right-3 flex items-center z-10">
              <div className="animate-ping h-3 w-3 rounded-full bg-red-600 opacity-75 mr-2"></div>
              <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-xs">
                Analyzing...
              </span>
            </div>
          )}

          {/* Control button - pindahkan lebih ke atas untuk menghindari masalah di mobile */}
          <div className="absolute bottom-20 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={togglePrediction}
              disabled={isModelLoading}
              className={`py-3 px-6 rounded-lg text-white font-medium shadow-lg flex items-center justify-center ${
                isPredicting
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isPredicting ? (
                <>
                  <Pause size={20} className="mr-2" />
                  Hentikan Prediksi
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" />
                  Mulai Prediksi
                </>
              )}
            </button>
          </div>

          {/* Prediction results */}
          {predictions.length > 0 && isPredicting && (
            <div className="absolute top-3 left-3 w-64 md:w-80 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg z-20">
              {/* Show top result */}
              {predictions.length > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-black">
                      {predictions[0].class}
                    </span>
                    <span className="text-blue-700 font-medium">
                      {(predictions[0].probability * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{
                        width: `${(predictions[0].probability * 100).toFixed(
                          2
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Collapse button to show all results */}
              <div className="collapse collapse-arrow bg-white bg-opacity-70 rounded-lg">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-medium text-center text-sm text-gray-600 py-2">
                  Lihat Semua Hasil
                </div>
                <div className="collapse-content">
                  {predictions.slice(1, 5).map((prediction, index) => {
                    const percentage = (prediction.probability * 100).toFixed(
                      2
                    );
                    return (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-black">
                            {prediction.class}
                          </span>
                          <span className="text-blue-700">{percentage}%</span>
                        </div>

                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveClassifier;
