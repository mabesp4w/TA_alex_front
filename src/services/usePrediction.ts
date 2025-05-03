/** @format */

import { useState, useCallback } from "react";
import {
  sendImageForPrediction,
  PredictionResult,
  fetchClassData,
  ClassData,
} from "./predictionService";

interface UsePredictionReturn {
  isCapturing: boolean;
  currentImage: string | null;
  predictionResult: PredictionResult | null;
  isLoading: boolean;
  classData: ClassData;
  startCapturing: () => void;
  stopCapturing: () => void;
  handleImageCapture: (imageData: string) => Promise<void>;
  loadClassData: () => Promise<void>;
}

export const usePrediction = (): UsePredictionReturn => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classData, setClassData] = useState<ClassData>({});

  // Fungsi untuk memuat data kelas
  const loadClassData = useCallback(async () => {
    try {
      const data = await fetchClassData();
      setClassData(data);
    } catch (error) {
      console.error("Error loading class data:", error);
    }
  }, []);

  // Fungsi untuk menangani gambar yang diambil
  const handleImageCapture = useCallback(async (imageData: string) => {
    setCurrentImage(imageData);
    setIsLoading(true);

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
  }, []);

  // Fungsi untuk memulai pengambilan gambar otomatis
  const startCapturing = useCallback(() => {
    setIsCapturing(true);
  }, []);

  // Fungsi untuk menghentikan pengambilan gambar otomatis
  const stopCapturing = useCallback(() => {
    setIsCapturing(false);
    // Reset state saat capture dimatikan
    setCurrentImage(null);
    setPredictionResult(null);
  }, []);

  return {
    isCapturing,
    currentImage,
    predictionResult,
    isLoading,
    classData,
    startCapturing,
    stopCapturing,
    handleImageCapture,
    loadClassData,
  };
};

export default usePrediction;
