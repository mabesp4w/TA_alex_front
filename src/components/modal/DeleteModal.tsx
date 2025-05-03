/** @format */

import ModalDef from "@/components/modal/ModalDef";
import { closeModal } from "@/utils/modalHelper";
import React from "react";

type Props = {
  setDelete: ({ id, isDelete }: any) => void;
};

const DeleteModal = ({ setDelete }: Props) => {
  const deletNow = () => {
    setDelete({ isDelete: true });
    closeModal("modal_delete");
  };
  return (
    <ModalDef id="modal_delete" title={``}>
      <p>Apakah anda yakin ingin menghapus data ini?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => closeModal("modal_delete")}
          className="btn btn-outline"
        >
          Batal
        </button>
        <button className="btn btn-error" onClick={() => deletNow()}>
          Hapus
        </button>
      </div>
    </ModalDef>
  );
};

export default DeleteModal;
