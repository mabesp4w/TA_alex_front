/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { auth } from "@/services/baseURL";
import Cookies from "js-cookie";

// type data login
interface dataLogin {
  name?: string;
  email?: string;
  password?: string | number;
  password_confirmation?: string;
  client_id?: string;
  client_secret?: string;
  grant_type?: string;
}

interface Store {
  setToken: () => Promise<any>;
  dtUser?: any;
  setLogin: (
    data: dataLogin
  ) => Promise<{ status: string; data?: any; error?: any }>;
  cekToken: () => Promise<{ status: string; data?: any; error?: any }>;
}

const useLogin = create(
  devtools<Store>((set, get) => ({
    setToken: async () => {
      const getToken = Cookies.get("token");
      return getToken;
    },
    setLogin: async (data) => {
      try {
        const response = await auth({
          method: "post",
          url: `/login/`, // Gunakan endpoint simple-login yang baru
          data: data, // Kirim langsung sebagai JSON
          headers: {
            "Content-Type": "application/json",
          },
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

export default useLogin;
