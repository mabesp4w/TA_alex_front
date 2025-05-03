/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { auth } from "@/services/baseURL";
import Cookies from "js-cookie";

// type data login
interface Props {
  name?: string;
  email: string;
  password: string | number;
  password_confirmation?: string;
}
interface Store {
  setToken: () => Promise<any>;
  setRegister: (
    data: Props
  ) => Promise<{ status: string; data?: any; error?: any }>;
  cekToken: () => Promise<{ status: string; data?: any; error?: any }>;
}

const useRegister = create(
  devtools<Store>((set, get) => ({
    setToken: async () => {
      const getToken = Cookies.get("token");
      return getToken;
    },
    setRegister: async (data) => {
      try {
        const response = await auth({
          method: "post",
          url: `/register/`,
          data,
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
    cekToken: async () => {
      const token = await get().setToken();
      try {
        const response = await auth({
          method: "post",
          url: `/check-token/`,
          headers: { Authorization: `Bearer ${token}` },
        });
        set((state) => ({ ...state, dtUser: response.data?.user }));
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

export default useRegister;
