/** @format */

import getProperty from "@/services/getProperty";
import React, { FC } from "react";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

type Props = {
  headTable: string[];
  tableBodies: string[];
  dataTable: any;
  setEdit?: (data: any) => void | undefined;
  setDelete?: ({
    id,
    isDelete,
  }: {
    id?: number | string;
    isDelete: boolean;
  }) => void;
  ubah?: boolean;
  hapus?: boolean;
  costume?: any;
  page: number;
  limit: number;
  setIndexBox?: (data: number) => void;
  onClick?: (data?: any) => void;
};

const TableDef: FC<Props> = ({
  headTable,
  tableBodies,
  dataTable,
  setEdit,
  setDelete,
  costume,
  page,
  limit,
  setIndexBox,
  ubah = true,
  hapus = true,
  onClick,
}) => {
  // membuat no urut
  const showNo = (index: number) => {
    const noUrut = (page - 1) * limit + index;
    return noUrut + 1;
  };
  return (
    <table className="table table-lg table-pin-rows">
      <thead>
        <tr>
          {headTable &&
            headTable.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {/* loop tr */}
        {dataTable &&
          dataTable.map((row: any, index: number) => {
            const { id } = row;
            const dtIndex = index;
            return (
              <tr
                key={index}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onClick?.(row);
                }}
                className={`${onClick ? "cursor-grab" : ""}`}
              >
                <td className="px-6 py-4 rounded-l-xl">{showNo(index)}</td>
                {/* loop td */}
                {tableBodies.map((column, index) => {
                  return (
                    <td key={index} className={`px-6 py-4`}>
                      {getProperty(row, column, dtIndex, setIndexBox)}
                    </td>
                  );
                })}
                {/* aksi */}
                <td className="px-6 py-4 rounded-r-xl">
                  <div className="flex flex-row gap-2">
                    {/*  */}
                    {costume && costume(row)}
                    {ubah && (
                      <BsFillPencilFill
                        onClick={(e) => {
                          e.stopPropagation(); // Tambahkan ini
                          setEdit?.(row);
                        }}
                        size={20}
                        className="cursor-pointer hover:text-yellow-500"
                        title="Ubah"
                      />
                    )}
                    {hapus && (
                      <BsFillTrashFill
                        onClick={(e) => {
                          e.stopPropagation(); // Tambahkan ini
                          setDelete?.({ id, isDelete: false });
                        }}
                        size={20}
                        className="cursor-pointer hover:text-red-700"
                        title="Hapus"
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default TableDef;
