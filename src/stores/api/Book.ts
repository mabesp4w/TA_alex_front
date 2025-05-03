/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { BookType } from "@/types/BookType";
import Cookies from "js-cookie";
// api books
const token = Cookies.get("token");

type Store = {
  dtBooks: BookType[];
  latestBooks: BookType[];
  popularBooks: BookType[];
  showBooks?: BookType;
  setBooks: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  setShowBooks: (id: string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setLatestBooks: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  setPopularBooks: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
};

const useBooksApi = create(
  devtools<Store>((set) => ({
    dtBooks: [],
    latestBooks: [],
    popularBooks: [],
    setBooks: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/books`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtBooks: response.data,
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
    setShowBooks: async (id) => {
      try {
        const response = await api({
          method: "get",
          url: `/books/${id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showBooks: response.data.data,
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

    setLatestBooks: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/books/latest/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          latestBooks: response.data,
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
    setPopularBooks: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/books/popular/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          popularBooks: response.data,
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

export default useBooksApi;
