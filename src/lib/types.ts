/** @format */

// Definisi tipe untuk model database

export type MedicinalPlant = {
  id: number;
  plant_nm: string;
  latin_nm: string | null;
  description: string | null;
  usage_method: string | null;
  benefits: string;
  image: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  categories?: PlantCategory[];
  parts?: PlantPart[];
  diseases?: Disease[];
  models_3d?: Plant3DModel[];
};

export type PlantCategory = {
  id: number;
  category_nm: string;
  description: string | null;

  // Relations
  plants?: MedicinalPlant[];
};

export type PlantPart = {
  id: number;
  plant_part_nm: string;
  description: string | null;

  // Relations
  plants?: MedicinalPlant[];
};

export type Disease = {
  id: number;
  disease_nm: string;
  description: string | null;
  symptoms: string | null;

  // Relations
  plants?: MedicinalPlant[];
  plant_relations?: PlantDiseaseRelation[];
};

export type PlantDiseaseRelation = {
  id: number;
  plant_id: number;
  disease_id: number;
  notes: string | null;

  // Relations
  plant?: MedicinalPlant;
  disease?: Disease;
};

export type Plant3DModel = {
  id: number;
  plant_id: number;
  title: string;
  description: string | null;
  model_file: string;
  file_size: number | null;
  created_at: string;
  updated_at: string;
  is_default: boolean;

  // Relations
  plant?: MedicinalPlant;
};
