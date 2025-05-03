/** @format */

// Tipe-tipe yang digunakan di seluruh aplikasi prediksi

// Definisi untuk data kelas
export interface ClassData {
  [key: string]: string;
}

// Hasil dari prediksi
export interface PredictionResult {
  class_id: string; // ID kelas hasil prediksi
  class_name: string; // Nama kelas hasil prediksi
  confidence: number; // Tingkat keyakinan prediksi (0-1)
  success: boolean; // Status keberhasilan prediksi
  error?: string; // Pesan error jika gagal
}

// Data yang dikirim ke API
export interface PredictionRequest {
  image: string; // Base64 gambar tanpa header
}

// Respons dari API
export interface ApiPredictionResponse {
  class_id: string; // ID kelas hasil prediksi
  confidence: number; // Tingkat keyakinan prediksi
  success?: boolean; // Status keberhasilan (opsional)
  error?: string; // Pesan error jika gagal (opsional)
}

// Status prediksi
export enum PredictionStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

// Konfigurasi kamera
export interface CameraConfig {
  facingMode: "user" | "environment"; // Kamera depan atau belakang
  captureInterval: number; // Interval pengambilan gambar (ms)
  quality: number; // Kualitas gambar (0-1)
}
