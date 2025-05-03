/** @format */

import { create } from "zustand";
import { PlantPrediction } from "@/services/api";

interface PlantState {
  isProcessing: boolean;
  capturedImage: string | null;
  prediction: PlantPrediction | null;
  error: string | null;
  modelUrl: string | null;
  showAR: boolean;
  isAutoPredicting: boolean;

  // Actions
  setCapturedImage: (image: string | null) => void;
  setPrediction: (prediction: PlantPrediction | null) => void;
  setModelUrl: (url: string | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  toggleAR: (show?: boolean) => void;
  setAutoPredicting: (isAuto: boolean) => void;
  reset: () => void;
}

const usePlantStore = create<PlantState>((set) => ({
  isProcessing: false,
  capturedImage: null,
  prediction: null,
  error: null,
  modelUrl: null,
  showAR: false,
  isAutoPredicting: false,

  setCapturedImage: (image) => set({ capturedImage: image }),
  setPrediction: (prediction) => set({ prediction }),
  setModelUrl: (url) => set({ modelUrl: url }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  toggleAR: (show) =>
    set((state) => ({ showAR: show !== undefined ? show : !state.showAR })),
  setAutoPredicting: (isAuto) => set({ isAutoPredicting: isAuto }),
  reset: () =>
    set({
      capturedImage: null,
      prediction: null,
      error: null,
      modelUrl: null,
      // Tidak mereset mode AR atau auto predicting
    }),
}));

export default usePlantStore;
