/** @format */
"use client";
import InputText from "@/components/input/InputText";
import { FC } from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  control: Control<FormInputs>;
  watch: UseFormWatch<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
};

const FormRegister: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <div className="form-control">
        <InputText
          label="Username"
          name="username"
          type="text"
          placeholder="Masukkan username"
          register={register}
          required
          errors={errors}
        />
      </div>
      <div className="form-control">
        <InputText
          label="Nama Lengkap"
          name="name"
          type="text"
          placeholder="Masukkan nama lengkap"
          register={register}
          required={true}
          errors={errors}
        />
      </div>

      <div className="form-control">
        <InputText
          label="Email"
          name="email"
          type="email"
          placeholder="Masukkan email anda"
          register={register}
          required={true}
          errors={errors}
        />
      </div>

      <div className="form-control">
        <InputText
          label="Password"
          name="password"
          type="password"
          placeholder="Masukkan password"
          register={register}
          required={true}
          errors={errors}
          minLength={6}
        />
      </div>

      <div className="form-control">
        <InputText
          label="Konfirmasi Password"
          name="password_confirm"
          type="password"
          placeholder="Konfirmasi password anda"
          register={register}
          required={true}
          errors={errors}
          minLength={6}
        />
      </div>
    </>
  );
};

export default FormRegister;
