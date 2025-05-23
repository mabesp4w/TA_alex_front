/** @format */

export interface MedicinalPlant {
  id: number;
  plant_nm: string;
  latin_nm?: string;
  description?: string;
  usage_method?: string;
  benefits: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface PlantCategory {
  id: number;
  category_nm: string;
  description?: string;
  plants?: MedicinalPlant[];
}

export interface PlantPart {
  id: number;
  plant_part_nm: string;
  description?: string;
}

export interface Disease {
  id: number;
  disease_nm: string;
  description?: string;
  symptoms?: string;
  plants?: MedicinalPlant[];
}

export interface PlantCategoryRelation {
  id: number;
  plant: number;
  category: PlantCategory;
}

export interface PlantPartRelation {
  id: number;
  plant: number;
  part: PlantPart;
}

export interface PlantDiseaseRelation {
  id: number;
  plant: number;
  disease: Disease;
  notes?: string;
}

export interface Plant3DModel {
  id: number;
  plant: number;
  title: string;
  description?: string;
  model_file: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
  is_default: boolean;
}

// Extended interface untuk response API yang include relations
export interface PlantDetailResponse {
  plant: MedicinalPlant;
  categories: PlantCategory[];
  parts: PlantPart[];
  diseases: Disease[];
  models_3d: Plant3DModel[];
  plant_parts: PlantPart[];
  plant_nm: string;
  benefits: string;
}

// Interface untuk prediction result (sudah ada di code asli)
export interface PredictionResult {
  class: string;
  probability: number;
}
