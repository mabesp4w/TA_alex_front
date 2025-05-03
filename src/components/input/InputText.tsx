/** @format */

import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { BsEyeSlash, BsEye } from "react-icons/bs";

type Props = {
  label?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  name: string;
  minLength?: number;
  maxLength?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  valueAsNumber?: boolean;
  type?: "text" | "password" | "number" | "email" | "date" | "time" | "hidden";
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  addClass?: string;
  labelClass?: string;
  value?: string | number;
};

const InputText = ({
  label,
  register,
  required,
  name,
  minLength,
  maxLength,
  errors,
  valueAsNumber,
  type = "text",
  readOnly,
  placeholder,
  autoComplete = "on",
  addClass,
  labelClass,
  value,
}: Props) => {
  const [isTypePassword, setIsTypePassword] = useState(false);
  const tooglePassword = () => {
    setIsTypePassword(!isTypePassword);
  };
  return (
    <label className={`relative ${addClass}`}>
      <div className="flex">
        {label && (
          <div className={`label ${labelClass}`}>
            <span className={`label-text ${labelClass}`}>{label}</span>
          </div>
        )}
        {required && label && (
          <span className="ml-1 text-red-600 self-center">*</span>
        )}
        {!required && label && (
          <span className="label-text ml-1 self-center">(Optional)</span>
        )}
      </div>
      <input
        type={
          type === "password" ? (isTypePassword ? "text" : "password") : type
        }
        placeholder={placeholder}
        className="input input-bordered w-full text-gray-600"
        readOnly={readOnly}
        autoComplete={autoComplete}
        {...register(name as any, {
          required,
          minLength,
          maxLength,
          valueAsNumber,
        })}
        defaultValue={value}
      />
      {type === "password" && (
        <div
          className="absolute  right-2 h-fit top-12 cursor-pointer text-accent flex items-center"
          onClick={tooglePassword}
        >
          <div className="">
            {isTypePassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
          </div>
        </div>
      )}
      {errors?.type === "required" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh kosong
        </p>
      )}
      {errors?.type === "minLength" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh kurang dari {minLength} karakter
        </p>
      )}
      {errors?.type === "maxLength" && (
        <p className="text-red-600 italic text-sm">
          {label} tidak boleh lebih dari {maxLength} karakter
        </p>
      )}
      {errors?.type === "pattern" && (
        <p className="text-red-600 italic text-sm">
          {label} hanya boleh angka.
        </p>
      )}
    </label>
  );
};

export default InputText;
