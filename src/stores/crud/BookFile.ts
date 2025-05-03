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
import { BookFileType } from "@/types/BookFileType";
// store bookFile
type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
  type?: string;
  book_id?: string;
};

type Store = {
  dtBookFile: {
    last_page: number;
    current_page: number;
    data: BookFileType[];
  };

  showDtBookFile: BookFileType | null;

  setBookFile: ({
    page,
    limit,
    search,
    sortby,
    order,
    type,
  }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowBookFile: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  addData: (
    data: BookFileType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: BookFileType
  ) => Promise<{ status: string; data?: any; error?: any }>;

  setFormData: any;
};

const useBookFile = create(
  devtools<Store>((set, get) => ({
    setFormData: (row: BookFileType) => {
      const formData = new FormData();
      formData.append("file_type", "PDF");
      formData.append("is_original", "1");
      formData.append("book", row.book_id);
      formData.append("file_book", row.file_book);

      return formData;
    },

    dtBookFile: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showDtBookFile: null,
    setBookFile: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      type,
      book_id,
    }) => {
      try {
        const token = await useLogin.getState().setToken();
        const response = await crud({
          method: "get",
          url: `/book-files/by_book`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit,
            page,
            search,
            sortby,
            order,
            type,
            book_id,
          },
        });
        set((state) => ({ ...state, dtBookFile: response.data.data }));
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
    setShowBookFile: async (id) => {
      try {
        const token = await useLogin.getState().setToken();
        const response = await crud({
          method: "get",
          url: `/book-files/${id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showDtBookFile: response.data.data,
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
      const formData = get().setFormData(row);
      try {
        const token = await useLogin.getState().setToken();
        const res = await crud({
          method: "post",
          url: `/book-files/`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: formData,
        });
        // call setBookFile
        get().setBookFile({
          page: 1,
          limit: 10,
          search: "",
          sortby: "",
          order: "",
          type: "",
          book_id: row.book_id,
        });

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
          url: `/book-files/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtBookFile: {
            last_page: prevState.dtBookFile.last_page,
            current_page: prevState.dtBookFile.current_page,
            data: prevState.dtBookFile.data.filter(
              (item: any) => item.id !== id
            ),
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
      const formData = row?.file_book ? get().setFormData(row) : row;
      const token = await useLogin.getState().setToken();
      const headersImg = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      try {
        const token = await useLogin.getState().setToken();

        const response = await crud({
          method: "PUT",
          url: `/book-files/${id}/`,
          headers: row?.file_book
            ? headersImg
            : {
                Authorization: `Bearer ${token}`,
              },
          data: formData,
        });
        set((prevState) => ({
          dtBookFile: {
            last_page: prevState.dtBookFile.last_page,
            current_page: prevState.dtBookFile.current_page,
            data: prevState.dtBookFile.data.map((item: any) => {
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

export default useBookFile;
