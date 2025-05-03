/** @format */

import React, { ReactNode } from "react";

type Props = {
  id: string;
  title?: string;
  children?: ReactNode;
};

const ModalDef = ({ id, title, children }: Props) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box relative max-h-screen overflow-visible z-50">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="relative">{children}</div>
      </div>
      <form method="dialog" className="modal-backdrop z-40">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ModalDef;
