/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { BookFileType } from "@/types/BookFileType";
import Cookies from "js-cookie";
// api bookFile

const token = Cookies.get("token");

interface Props {
  id?: string;
  type?: string;
}

type Store = {
  dtBookFile: BookFileType[];
  showBookFile?: BookFileType;
  setBookFile: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  setBookFileAll: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  setShowBookFile: ({ id, type }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
};

const useBookFileApi = create(
  devtools<Store>((set) => ({
    dtBookFile: [],
    setBookFile: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/book_file`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtBookFile: response.data,
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
    setBookFileAll: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/book_file/all`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtBookFile: response.data.data,
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
    setShowBookFile: async ({ id, type = "epub" }) => {
      try {
        const response = await api({
          method: "get",
          url: `/book_file/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          params: { type },
        });
        set((state) => ({
          ...state,
          showBookFile: response.data.data,
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

export default useBookFileApi;
