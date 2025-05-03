/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */
"use client";
import useLogin from "@/stores/auth/login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import FormLogin from "./FormLogin";
import Link from "next/link";

type Inputs = {
  email: string;
  password: string | number;
};

const Login = () => {
  // store
  const { setLogin, cekToken } = useLogin();
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // jika sudah login
  const fetchAuth = async () => {
    const token = Cookies.get("token");
    if (token) {
      const cekAuth = await cekToken();
      if (!cekAuth?.error) {
        const role = Cookies.get("role");
        if (role === "admin") {
          return router.push("/admin/dashboard");
        }
        if (role === "user") {
          return router.push("/dashboard");
        }
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchAuth();
    }
  }, []);

  // hook form
  const {
    register,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (row) => {
    setIsLoading(true);
    setError("");
    const res = await setLogin(row);
    console.log(res);
    if (res?.error) {
      setError(res?.error?.message);
    } else {
      const { data } = res;
      Cookies.set("token", data.access_token, { expires: 7 });
      Cookies.set("role", data.user.role, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
      if (data.user.role === "admin") {
        return router.push("/admin/dashboard");
      } else {
        return router.push("/dashboard");
      }
    }

    if (res) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };
  return (
    <div className="min-h-screen bg-1 bg-cover bg-center font-prompt">
      <div className="flex flex-col items-center min-h-screen justify-center backdrop-blur-sm bg-black/50 z-10">
        <div className="bg-white/10 text-font-1 rounded py-8 px-4 mx-6 md:py-8 md:px-12 flex flex-col items-center justify-center z-50">
          <div className="w-full mb-2">
            <h5 className="text-sm font-bold text-center md:text-xl text-white">
              Selamat datang di
            </h5>
            <h3 className="text-center mt-2 md:text-2xl text-base text-white font-extrabold">
              Ruang Baca WWF
            </h3>
          </div>
          <p className="text-center mt-2 text-[10px] text-gray-100 text-base">
            Silahkan login untuk mendapatkan akses ke halaman admin
          </p>
          <span>
            {error && <p className="text-red-600 text-center">{error}</p>}
          </span>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full">
            <FormLogin
              register={register}
              errors={errors}
              control={control}
              watch={watch}
              setValue={setValue}
            />
            <div className="mt-4">
              {isLoading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  onClick={handleSubmit(onSubmit)}
                >
                  Login
                </button>
              )}
            </div>
            <div className="text-center mt-4 text-accent">
              <p>
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-primary">
                  Daftar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
