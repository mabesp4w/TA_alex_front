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
import { BookType } from "@/types/BookType";
// store book
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  type?: string;
};

type Store = {
  dtBook: {
    last_page: number;
    current_page: number;
    data: BookType[];
  };

  showDtBook: BookType | null;

  setBook: ({ page, limit, search, sortby, order, type }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowBook: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  addData: (
    data: BookType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: BookType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  setFormData: any;
};

const useBook = create(
  devtools<Store>((set, get) => ({
    setFormData: (row: BookType) => {
      const formData = new FormData();
      formData.append("title", row.title);
      formData.append("author", row.author);
      formData.append("publisher", row.publisher);
      formData.append("year", row.year.toString());

      // Menangani file cover_image
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (row.cover_image instanceof File) {
        formData.append("cover_image", row.cover_image);
      }

      // Cara mengirim array categories yang lebih spesifik
      // Mengirim setiap kategori sebagai parameter terpisah dengan indeks
      if (Array.isArray(row.categories)) {
        row.categories.forEach((category, index) => {
          formData.append(`categories[${index}]`, category as any);
        });
      }

      return formData;
    },

    dtBook: {
      last_page: 0,
      current_page: 0,
      data: [],
    },

    showDtBook: null,
    setBook: async ({ page = 1, limit = 10, search, sortby, order, type }) => {
      try {
        const token = await useLogin.getState().setToken();
        const response = await crud({
          method: "get",
          url: `/books`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            type,
          },
        });
        set((state) => ({ ...state, dtBook: response.data.data }));
        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },
    setShowBook: async (id) => {
      try {
        const token = await useLogin.getState().setToken();
        const response = await crud({
          method: "get",
          url: `/books/${id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showDtBook: response.data.data,
        }));

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },
    addData: async (row) => {
      const formData = row?.cover_image ? get().setFormData(row) : row;
      try {
        const token = await useLogin.getState().setToken();
        const res = await crud({
          method: "post",
          url: `/books/`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: formData,
        });
        console.log({ res });
        set((prevState) => ({
          dtBook: {
            last_page: prevState.dtBook.last_page,
            current_page: prevState.dtBook.current_page,
            data: [res.data.data, ...prevState.dtBook.data],
          },
        }));
        return {
          status: "berhasil tambah",
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
    removeData: async (id) => {
      try {
        const token = await useLogin.getState().setToken();
        const res = await crud({
          method: "delete",
          url: `/books/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtBook: {
            last_page: prevState.dtBook.last_page,
            current_page: prevState.dtBook.current_page,
            data: prevState.dtBook.data.filter((item: any) => item.id !== id),
          },
        }));
        return {
          status: "berhasil hapus",
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
    updateData: async (id, row) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete row.id;
      const formData = row?.cover_image ? get().setFormData(row) : row;
      const token = await useLogin.getState().setToken();
      const headersImg = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      try {
        const token = await useLogin.getState().setToken();

        const response = await crud({
          method: "PUT",
          url: `/books/${id}/`,
          headers: row?.cover_image
            ? headersImg
            : {
                Authorization: `Bearer ${token}`,
              },
          data: formData,
        });
        set((prevState) => ({
          dtBook: {
            last_page: prevState.dtBook.last_page,
            current_page: prevState.dtBook.current_page,
            data: prevState.dtBook.data.map((item: any) => {
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
        return {
          status: "berhasil update",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          data: error.response.data,
        };
      }
    },
  }))
);

export default useBook;
