/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { CategoryType } from "@/types/CategoryType";
import Cookies from "js-cookie";
// api category

const token = Cookies.get("token");

type Store = {
  dtCategory: CategoryType[];
  popularCategory: CategoryType[];
  showCategory?: CategoryType;
  setCategory: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowCategory: (id: string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setPopularCategory: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
};

const useCategoryApi = create(
  devtools<Store>((set) => ({
    dtCategory: [],
    popularCategory: [],
    setCategory: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/categories`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtCategory: response.data,
        }));
        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response.data,
        };
      }
    },
    setShowCategory: async (id) => {
      try {
        const response = await api({
          method: "get",
          url: `/categories/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showCategory: response.data,
        }));
        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response.data,
        };
      }
    },
    setPopularCategory: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/categories/popular`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          popularCategory: response.data,
        }));
        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response.data,
        };
      }
    },
  }))
);

export default useCategoryApi;
