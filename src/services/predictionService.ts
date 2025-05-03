/** @format */

import axios from "axios";
import { BASE_URL } from "./baseURL";

export interface ClassData {
  [key: string]: string;
}

export interface PredictionResult {
  success: boolean;
  class_id: string;
  class_name: string;
  confidence: number;
  error?: string;
  all_predictions?: Array<{
    class_id: string;
    class_name: string;
    probability: number;
  }>;
}

// Fungsi untuk mengambil data kelas dari server
export const fetchClassData = async (): Promise<ClassData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/media/ml_models/nama_kelas.json`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching class data:", error);
    return {
      "0": "Bukan Tanaman",
      "1": "Daun Kemangi",
      "2": "Daun Kunyit",
      "3": "Daun Pepaya",
      "4": "Daun Sirih",
      "5": "Daun Sirsak",
      "6": "Lidah Buaya",
    };
  }
};

// Fungsi untuk mengirim gambar ke API prediksi
export const sendImageForPrediction = async (
  imageData: string
): Promise<PredictionResult> => {
  try {
    // Hapus header base64 dari data URL
    const base64Image = imageData.split(",")[1];

    // Log untuk debugging
    console.log("Mengirim data ke API...");

    // Gunakan parameter image_base64 sesuai error message
    const response = await axios.post(
      `${BASE_URL}/crud/predict/`,
      { image_base64: base64Image },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Respons dari API:", response.data);

    // Handle new API response format
    if (
      response.data &&
      response.data.status === "success" &&
      response.data.data?.top_prediction
    ) {
      const topPrediction = response.data.data.top_prediction;
      const allPredictions = response.data.data.all_predictions;

      return {
        success: true,
        class_id: topPrediction.class_id,
        class_name: topPrediction.class_name,
        confidence: topPrediction.probability / 100, // Convert percentage to 0-1 scale
        all_predictions: allPredictions,
      };
    } else {
      throw new Error("Format respons tidak valid");
    }
  } catch (error: any) {
    console.error("Error sending image for prediction:", error);

    // Log response data jika ada
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }

    return {
      success: false,
      class_id: "-1",
      class_name: "Error",
      confidence: 0,
      error:
        error.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat melakukan prediksi"),
    };
  }
};
