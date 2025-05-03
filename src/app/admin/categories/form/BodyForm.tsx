/** @format */

import InputText from "@/components/input/InputText";
import { CategoryType } from "@/types/CategoryType";
import { FC } from "react";
import { FieldErrors } from "react-hook-form";
// category
type Props = {
  register: any;
  errors: FieldErrors<CategoryType>;
  dtEdit: CategoryType | null;
  control: any;
  watch: any;
  setValue: any;
};

const BodyForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <InputText
        label={`Nama Kategori`}
        name="category_nm"
        register={register}
        addClass="col-span-8"
        required
        errors={errors.category_nm}
      />
    </>
  );
};

export default BodyForm;
