/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import useLogin from "../auth/login";
import { ReadingProgress } from "@/types";

// store readingProgress
type Props = {
  page?: number;
  per_page?: number;
  search?: string;
  sortby?: string;
  order?: string;
  book?: string;
  file_type?: string;
};

type Store = {
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  dtReadingProgress: {
    last_page: number;
    current_page: number;
    data: ReadingProgress[];
  };

  setReadingProgress: ({
    page,
    per_page,
    search,
    sortby,
    order,
    book,
    file_type,
  }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowReadingProgress: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  addData: (
    data: ReadingProgress
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: ReadingProgress
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useReadingProgress = create(
  devtools<Store>((set) => ({
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    dtReadingProgress: {
      last_page: 0,
      current_page: 0,
      data: [],
    },

    setReadingProgress: async ({
      page = 1,
      per_page = 10,
      search,
      sortby,
      order,
      book,
      file_type,
    }) => {
      set({ isLoading: true });
      const token = await useLogin.getState().setToken();
      try {
        // Prepare params, only include non-empty values
        const params: Record<string, any> = { per_page, page };
        if (search) params.search = search;
        if (sortby) params.sortby = sortby;
        if (order) params.order = order;
        if (book) params.book = book;
        if (file_type) params.file_type = file_type;

        const response = await crud({
          method: "get",
          url: `/reading-progress`,
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        set((state) => ({
          ...state,
          dtReadingProgress: response.data.data,
          isLoading: false,
        }));

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        set({ isLoading: false });
        console.log({ error });
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    setShowReadingProgress: async (id) => {
      set({ isLoading: true });
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/reading-progress/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          ...state,
          dtReadingProgress: response.data.data,
          isLoading: false,
        }));

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        set({ isLoading: false });
        console.log({ error });
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    addData: async (row) => {
      set({ isCreating: true });
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "post",
          url: `/reading-progress/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });

        set((prevState) => ({
          isCreating: false,
          dtReadingProgress: {
            last_page: prevState.dtReadingProgress.last_page,
            current_page: prevState.dtReadingProgress.current_page,
            data: [res.data.data, ...prevState.dtReadingProgress.data],
          },
        }));

        // No toast notification for progress updates to avoid spam
        // toast.success("Progress membaca berhasil disimpan");

        return {
          status: "berhasil tambah",
          data: res.data,
        };
      } catch (error: any) {
        set({ isCreating: false });
        console.log({ error });
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },

    removeData: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "delete",
          url: `/reading-progress/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });

        set((prevState) => ({
          dtReadingProgress: {
            last_page: prevState.dtReadingProgress.last_page,
            current_page: prevState.dtReadingProgress.current_page,
            data: prevState.dtReadingProgress.data.filter(
              (item: any) => item.id !== id
            ),
          },
        }));

        console.log(res);

        return {
          status: "berhasil hapus",
          data: res.data,
        };
      } catch (error: any) {
        console.log({ error });
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },

    updateData: async (id, row) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/reading-progress/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });

        set((prevState) => ({
          isUpdating: false,
          dtReadingProgress: {
            last_page: prevState.dtReadingProgress.last_page,
            current_page: prevState.dtReadingProgress.current_page,
            data: prevState.dtReadingProgress.data.map((item: any) => {
              if (item.id === id) {
                return {
                  ...item,
                  ...response.data.data,
                };
              } else {
                return item;
              }
            }),
          },
        }));

        // No toast notification for regular progress updates to avoid spam
        // toast.success("Progress membaca berhasil diperbarui");

        return {
          status: "berhasil update",
          data: response.data,
        };
      } catch (error: any) {
        set({ isUpdating: false });
        console.log({ error });
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
  }))
);

export default useReadingProgress;
