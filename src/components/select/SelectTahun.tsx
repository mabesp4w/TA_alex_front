import { FC, useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import { Controller } from "react-hook-form";

type Props = {
    label?: string;
    start: number;
    end: number;
    control: any;
    required?: boolean;
    name: string;
    errors?: any;
    addClass: any;
    menuPosition?: string;
    placeholder?: string;
    fromMax?: boolean;
};

const SelectTahun: FC<Props> = ({
    label,
    start = 2012,
    end = moment().format("YYYY"),
    control,
    required,
    name,
    errors,
    addClass,
    menuPosition = "fixed" as any,
    placeholder = "Pilih Tahun",
    fromMax = false,
}) => {
    const pilihTahun = () => {
        const array = [];
        if (fromMax) {
            for (let index: any = end; index >= start; index--) {
                array.push({ value: index, label: index });
            }
        } else {
            for (let index: any = start; index <= end; index++) {
                array.push({ value: index, label: index });
            }
        }
        return array;
    };
    const [menuPortalTarget, setMenuPortalTarget] = useState<any>(null);
    useEffect(() => {
        // Pastikan kode ini hanya dijalankan di lingkungan browser
        if (typeof document !== "undefined") {
            setMenuPortalTarget(document.body);
        }
    }, []);
    return (
        <div className={addClass}>
            {label && (
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                    {label}
                </label>
            )}
            {required && <span className="ml-1 text-red-600">*</span>}
            {menuPortalTarget && (
                <Controller
                    name={name}
                    control={control}
                    rules={{ required }}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            isClearable={true}
                            isSearchable={true}
                            options={pilihTahun()}
                            placeholder={placeholder}
                            menuPosition={menuPosition}
                            ref={ref}
                            value={
                                value
                                    ? pilihTahun().find(
                                          (x) => x.value === value
                                      )
                                    : value
                            }
                            onChange={(option: any) =>
                                onChange(option ? option.value : option)
                            }
                        />
                    )}
                />
            )}
            {errors?.type === "required" && (
                <p className="text-red-500 font-inter italic text-sm">
                    Tahun tidak boleh kosong
                </p>
            )}
        </div>
    );
};

export default SelectTahun;
