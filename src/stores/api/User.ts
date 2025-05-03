/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { User } from "@/types";
import Cookies from "js-cookie";
// api user
const token = Cookies.get("token");
type Store = {
  dtUser: User[];
  showUser?: User;
  setUser: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  setUserAll: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
  setShowUser: (id: string) => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
};

const useUserApi = create(
  devtools<Store>((set) => ({
    dtUser: [],
    setUser: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/user/`,
        });
        set((state) => ({
          ...state,
          dtUser: response.data,
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
    setUserAll: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/user/all/`,
        });
        set((state) => ({
          ...state,
          dtUser: response.data.data,
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
    setShowUser: async (id) => {
      try {
        const response = await api({
          method: "get",
          url: `/user/${id}/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({
          ...state,
          showUser: response.data,
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

export default useUserApi;
