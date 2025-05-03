/** @format */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import FormRegister from "./FormRegister";
import useRegister from "@/stores/auth/register";
import Link from "next/link";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  // store
  const { setRegister, cekToken } = useRegister();
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    // Validasi password dan confirm password

    setIsLoading(true);
    setError("");
    const res = await setRegister(row);
    console.log(res);
    if (res?.error) {
      setError(res?.error?.message);
    } else {
      const { data } = res;
      Cookies.set("token", data.token.access_token, { expires: 7 });
      Cookies.set("role", data.user.role, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
      return router.push("/dashboard");
    }

    if (res) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="hero min-h-screen  bg-base-200 bg-1 bg-cover bg-center">
      <div className="flex flex-col items-center min-h-screen w-full justify-center backdrop-blur-sm bg-black/50 z-10">
        <div className="hero-content flex-col w-full">
          <div className="text-center mb-4 text-white">
            <h1 className="text-5xl font-bold">Selamat datang di</h1>
            <h2 className="text-3xl font-bold mt-2">Ruang Baca WWF</h2>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <p className="text-center pb-3">
                Silahkan daftar untuk mendapatkan akses ke Ruang Baca WWF
              </p>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <FormRegister
                  register={register}
                  errors={errors}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                />

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Daftar"
                    )}
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p>
                    Sudah punya akun?{" "}
                    <Link href="/auth/login" className="text-primary">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
