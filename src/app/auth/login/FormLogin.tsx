/** @format */
"use client";
import InputText from "@/components/input/InputText";
import { FC } from "react";

type Props = {
  register: any;
  errors: any;
  control: any;
  watch: any;
  setValue: any;
};

const FormLogin: FC<Props> = ({ register, errors }) => {
  return (
    <div className="flex flex-col gap-y-2">
      <InputText
        label="Email"
        name="username"
        register={register}
        required
        minLength={2}
        errors={errors.email}
        addClass="col-span-4"
        type="email"
        labelClass="text-accent"
      />
      <InputText
        label="Password"
        name="password"
        register={register}
        required
        minLength={3}
        errors={errors.password}
        type="password"
        labelClass="text-accent"
      />
    </div>
  );
};

export default FormLogin;
