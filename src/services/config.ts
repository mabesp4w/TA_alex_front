/** @format */

// lib/config.ts

/**
 * Configuration for Plant Classifier AR Application
 */
export const CONFIG = {
  // API endpoints
  API_ENDPOINT: "http://127.0.0.1:8000/crud/predict/",
  CLASS_NAMES_ENDPOINT: "http://127.0.0.1:8000/media/ml_models/nama_kelas.json",
  MODEL_BASE_URL: "http://127.0.0.1:8000/media/medical_plant/",

  // Interval dan threshold
  PREDICTION_INTERVAL: 3000, // Interval prediksi dalam milidetik (3 detik)
  CONFIDENCE_THRESHOLD: 30, // Threshold kepercayaan minimum untuk menampilkan model 3D

  // AR settings
  MODEL_SCALE: 4, // Perbesar skala model 3D
  MODEL_POSITION: { x: 0, y: 0, z: -2 }, // Posisi model di ruang 3D
  MODEL_ROTATION_SPEED: 0.01, // Kecepatan rotasi model
};

export default CONFIG;
