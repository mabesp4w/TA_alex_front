/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { auth } from "@/services/baseURL";
import Cookies from "js-cookie";

interface Store {
  setToken: () => Promise<any>;
  setLogout: () => Promise<{ status: string; data?: any; error?: any }>;
}

const useLogout = create(
  devtools<Store>((set, get) => ({
    setToken: async () => {
      const getToken = Cookies.get("token");
      return getToken;
    },
    setLogout: async () => {
      const token = await get().setToken();
      try {
        const response = await auth({
          method: "post",
          url: `/logout/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        return {
          status: "success",
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

export default useLogout;
