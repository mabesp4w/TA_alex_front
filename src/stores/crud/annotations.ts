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
import { Annotation } from "@/types";
// store annotations
type Props = {
  page?: number;
  per_page?: number;
  search?: string;
  sortby?: string;
  order?: string;
};

type Store = {
  dtAnnotations: {
    last_page: number;
    current_page: number;
    data: Annotation[];
  };

  setAnnotations: ({
    page,
    per_page,
    search,
    sortby,
    order,
  }: Props) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  setShowAnnotations: (id: number | string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;

  addData: (
    data: Annotation
  ) => Promise<{ status: string; data?: any; error?: any }>;

  removeData: (
    id: number | string
  ) => Promise<{ status: string; data?: any; error?: any }>;

  updateData: (
    id: number | string,
    data: Annotation
  ) => Promise<{ status: string; data?: any; error?: any }>;
};

const useAnnotations = create(
  devtools<Store>((set) => ({
    dtAnnotations: {
      last_page: 0,
      current_page: 0,
      data: [],
    },
    setAnnotations: async ({
      page = 1,
      per_page = 10,
      search,
      sortby,
      order,
    }) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/annotations`,
          headers: { Authorization: `Bearer ${token}` },
          params: {
            per_page,
            page,
            search,
            sortby,
            order,
          },
        });
        set((state) => ({
          ...state,
          dtAnnotations: response.data.data,
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
    setShowAnnotations: async (id) => {
      const token = await useLogin.getState().setToken();
      try {
        const response = await crud({
          method: "get",
          url: `/annotations/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          dtAnnotations: response.data.data,
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
          url: `/annotations/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });

        console.log({ res });
        set((prevState) => ({
          dtAnnotations: {
            last_page: prevState.dtAnnotations.last_page,
            current_page: prevState.dtAnnotations.current_page,
            data: [res.data.data, ...prevState.dtAnnotations.data],
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
          url: `/annotations/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((prevState) => ({
          dtAnnotations: {
            last_page: prevState.dtAnnotations.last_page,
            current_page: prevState.dtAnnotations.current_page,
            data: prevState.dtAnnotations.data.filter(
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
          url: `/annotations/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
          data: row,
        });
        set((prevState) => ({
          dtAnnotations: {
            last_page: prevState.dtAnnotations.last_page,
            current_page: prevState.dtAnnotations.current_page,
            data: prevState.dtAnnotations.data.map((item: any) => {
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

export default useAnnotations;
