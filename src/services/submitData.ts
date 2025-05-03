/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

type Props = {
  row: any;
  dtEdit?: any;
  setIsLoading: (value: boolean) => void;
  setShowModal?: (value: boolean) => void;
  addData?: any;
  updateData?: any;
  resetForm?: () => void;
  toastShow?: any;
  goTo?: any;
};

// export default function
export default async function submitData({
  row,
  dtEdit,
  setIsLoading,
  setShowModal,
  addData,
  updateData,
  resetForm,
  toastShow,
  goTo,
}: Props) {
  setIsLoading(true);
  // jika dtEdit tidak kosong maka update
  if (dtEdit) {
    const { data } = await updateData(dtEdit.id, row);
    toastShow &&
      toastShow({
        event: data,
      });
    setShowModal && setShowModal(false);
    goTo && goTo();
  } else {
    const { data } = await addData(row);
    console.log({ data });
    toastShow &&
      toastShow({
        event: data,
      });
    if (data?.status === "success") {
      resetForm && resetForm();
      goTo && goTo();
    }
  }
  setIsLoading(false);
}
