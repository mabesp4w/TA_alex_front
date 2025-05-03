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
import { Book, Collection } from "@/types";
// store collection
type Props = {
  page?: number;
  per_page?: number;
  search?: string;
  sortby?: string;
  order?: string;
  user?: string;
};

type Store = {
  dtCollection: {
    last_page: number;
    current_page: number;
    data: Collection[];
  };

  setCollection: ({
    page,
    per_page,
    search,
    sortby,
    order,
    user,
  }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowCollection: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  showCollection: Collection | null;

  setAvailableBooks: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  dtAvailableBooks: Book[] | null;

  addData: (
    data: Collection
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: Collection
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useCollections = create(
  devtools<Store>((set) => ({
    dtCollection: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    showCollection: null,
    dtAvailableBooks: null,
    setCollection: async ({
      page = 1,
      per_page = 10,
      search,
      sortby,
      order,
      user,
    }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/collections/`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            per_page,
            page,
            search,
            sortby,
            order,
            user,
          },
        });
        set((state) => ({
          ...state,
          dtCollection: response.data.data,
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
    setShowCollection: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/collections/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showCollection: response.data.data,
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
    setAvailableBooks: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/collections/${id}/available_books/`,
          headers: { Authorization: `Bearer ${token}` },
          params: { per_page: 100 },
        });
        set((state) => ({
          ...state,
          dtAvailableBooks: response.data.data?.data,
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
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "post",
          url: `/collections/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });

        console.log({ res });
        set((prevState) => ({
          dtCollection: {
            last_page: prevState.dtCollection.last_page,
            current_page: prevState.dtCollection.current_page,
            data: [res.data.data, ...prevState.dtCollection.data],
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
      const token = await useLogin.getState().setToken();
      try {
        const res = await crud({
          method: "delete",
          url: `/collections/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtCollection: {
            last_page: prevState.dtCollection.last_page,
            current_page: prevState.dtCollection.current_page,
            data: prevState.dtCollection.data.filter(
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
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "PUT",
          url: `/collections/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtCollection: {
            last_page: prevState.dtCollection.last_page,
            current_page: prevState.dtCollection.current_page,
            data: prevState.dtCollection.data.map((item: any) => {
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

export default useCollections;
