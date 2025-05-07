/** @format */
"use client";
import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Pause, Play } from "lucide-react";

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
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const predictionIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    initializeCamera();

    // Cleanup on unmount
    return () => {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }
      stopCamera();
    };
  }, []);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      setCameraError(null);

      // Request camera access with environment (back) camera as preferred
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        console.log("Camera initialized successfully");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin kamera pada browser."
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

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
    if (isPredicting) {
      // Stop predictions
      stopPredictions();
    } else {
      // Start predictions
      startPredictions();
    }
  };

  // Start continuous predictions
  const startPredictions = () => {
    if (!model) {
      alert("Model belum dimuat sepenuhnya. Mohon tunggu.");
      return;
    }

    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Kamera tidak tersedia. Silahkan refresh halaman.");
      return;
    }

    setIsPredicting(true);

    // Perform initial prediction
    predictFromVideo();

    // Set up interval for continuous predictions (every 500ms)
    predictionIntervalRef.current = setInterval(() => {
      predictFromVideo();
    }, 500);
  };

  // Stop predictions
  const stopPredictions = () => {
    if (predictionIntervalRef.current) {
      clearInterval(predictionIntervalRef.current);
      predictionIntervalRef.current = null;
    }
    setIsPredicting(false);
  };

  // Function to capture and predict from video feed
  const predictFromVideo = () => {
    if (!model || !videoRef.current || videoRef.current.readyState !== 4) {
      return; // Skip if not ready
    }

    try {
      // Capture current frame from video
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Process the canvas and get predictions
      analyzeImage(canvas).then((results) => {
        setPredictions(results);
      });
    } catch (error) {
      console.error("Error during video prediction:", error);
    }
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Plant Classifier</h1>

      {isModelLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="ml-2">Loading model...</p>
        </div>
      ) : (
        <div>
          {cameraError ? (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 mb-4">
              <p>{cameraError}</p>
              <button
                onClick={initializeCamera}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-lg bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto"
                />

                {isPredicting && (
                  <div className="absolute top-3 right-3 flex items-center">
                    <div className="animate-ping h-3 w-3 rounded-full bg-red-600 opacity-75 mr-2"></div>
                    <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-xs">
                      Analyzing...
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <button
                  onClick={togglePrediction}
                  disabled={isModelLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center ${
                    isPredicting
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
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
            </>
          )}

          {predictions.length > 0 && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow text-black">
              <h2 className="text-lg font-semibold mb-3">Hasil Deteksi</h2>

              {predictions.slice(0, 5).map((prediction, index) => {
                const percentage = (prediction.probability * 100).toFixed(2);
                return (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{prediction.class}</span>
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
          )}
        </div>
      )}
    </div>
  );
};

export default LiveClassifier;
