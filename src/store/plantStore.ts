/** @format */

// store/plantStore.ts
import { create } from "zustand";
import { PlantDetailResponse } from "@/types";
import { url_api } from "@/services/baseURL";

interface PlantState {
  plantDetail: PlantDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchPlantDetail: (plantName: string) => Promise<void>;
  clearPlantDetail: () => void;
  clearError: () => void;
}

export const usePlantStore = create<PlantState>((set) => ({
  plantDetail: null,
  isLoading: false,
  error: null,

  fetchPlantDetail: async (plantName: string) => {
    set({ isLoading: true, error: null });

    try {
      // Encode plant name untuk URL
      const encodedPlantName = encodeURIComponent(plantName);
      const response = await fetch(
        `${url_api}/plant-detail/${encodedPlantName}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data tanaman tidak ditemukan");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlantDetailResponse = await response.json();
      set({ plantDetail: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching plant detail:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data",
        isLoading: false,
      });
    }
  },

  clearPlantDetail: () => {
    set({ plantDetail: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
