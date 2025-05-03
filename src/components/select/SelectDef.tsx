/** @format */

import { FC, useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { Controller } from "react-hook-form";

type Props = {
  label?: string;
  control: any;
  required?: boolean;
  name: string;
  errors?: any;
  addClass: any;
  menuPosition?: "fixed" | "absolute";
  placeholder?: string;
  options: any[];
  menuPortalTarget?: boolean;
};

const SelectDef: FC<Props> = ({
  label,
  control,
  required,
  name,
  errors,
  addClass,
  menuPosition = "fixed",
  placeholder = "Pilih...",
  options = [],
  menuPortalTarget = false,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const styles: StylesConfig<any, true> = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      pointerEvents: "auto",
    }),
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? {
            ...base,
            fontWeight: "bold",
            color: "white",
            paddingRight: 6,
          }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };

  if (!isClient) {
    return (
      <div className={addClass}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-black tracking-wide">
            {label}
          </label>
        )}
        {required && <span className="ml-1 text-red-600">*</span>}
        <div className="h-10 w-full bg-gray-50 rounded border border-gray-300" />
      </div>
    );
  }

  return (
    <div className={addClass}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-black tracking-wide">
          {label}
        </label>
      )}
      {required && <span className="ml-1 text-red-600">*</span>}
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field: { onChange, value, ref } }) => (
          <Select
            instanceId={name}
            isClearable={true}
            isSearchable={true}
            options={options}
            placeholder={placeholder}
            menuPlacement="auto"
            menuPosition={menuPosition}
            menuPortalTarget={menuPortalTarget ? document.body : null}
            styles={styles}
            ref={ref}
            value={
              value ? options.find((option) => option.value === value) : null
            }
            onChange={(option: any) => onChange(option ? option.value : option)}
          />
        )}
      />
      {errors?.type === "required" && (
        <p className="text-red-500 font-inter italic text-sm">
          {label || "Field"} tidak boleh kosong
        </p>
      )}
    </div>
  );
};

export default SelectDef;
