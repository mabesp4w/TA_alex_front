/** @format */

import axios from "axios";
import {
  MedicinalPlant,
  PlantCategory,
  PlantPart,
  Disease,
  Plant3DModel,
} from "./types";
import { url_api } from "@/services/baseURL";

// Setup API base URL sesuai environment
const API_BASE_URL = url_api;

// Fungsi fetcher umum untuk API
export async function fetchApi(endpoint: string, options = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, options);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Tanaman Obat APIs
export async function getMedicinalPlants(
  params?: any
): Promise<MedicinalPlant[]> {
  return fetchApi("/plants/", { params });
}

export async function getMedicinalPlantById(
  id: number
): Promise<MedicinalPlant> {
  return fetchApi(`/plants/${id}/`);
}

export async function getMedicinalPlantsByCategory(
  categoryId: number
): Promise<MedicinalPlant[]> {
  return fetchApi(`/categories/${categoryId}/`);
}

export async function getMedicinalPlantsByDisease(
  diseaseId: number
): Promise<MedicinalPlant[]> {
  return fetchApi(`/diseases/${diseaseId}/`);
}

// Kategori Tanaman APIs
export async function getPlantCategories(): Promise<PlantCategory[]> {
  return fetchApi("/categories/");
}

export async function getPlantCategoryById(id: number): Promise<PlantCategory> {
  return fetchApi(`/categories/${id}/`);
}

// Bagian Tanaman APIs
export async function getPlantParts(): Promise<PlantPart[]> {
  return fetchApi("/plant-parts/");
}

export async function getPlantPartById(id: number): Promise<PlantPart> {
  return fetchApi(`/plant-parts/${id}/`);
}

// Penyakit APIs
export async function getDiseases(params?: any): Promise<Disease[]> {
  return fetchApi("/diseases/", { params });
}

export async function getDiseaseById(id: number): Promise<Disease> {
  return fetchApi(`/diseases/${id}/`);
}

// Model 3D APIs
export async function getPlant3DModels(
  plantId: number
): Promise<Plant3DModel[]> {
  return fetchApi(`/medicinal-plants/${plantId}/3d-models/`);
}

export async function getPlant3DModelById(
  modelId: number
): Promise<Plant3DModel> {
  return fetchApi(`/3d-models/${modelId}/`);
}
