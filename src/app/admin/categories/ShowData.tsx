/** @format */
"use client";
import PaginationDef from "@/components/pagination/PaginationDef";
import TableDef from "@/components/table/TableDef";
import useCategory from "@/stores/crud/Category";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

type DeleteProps = {
  id?: number | string;
  isDelete: boolean;
};

type Props = {
  setDelete: ({ id, isDelete }: DeleteProps) => void;
  setEdit: (row: any) => void;
};

// category

const ShowData: FC<Props> = ({ setDelete, setEdit }) => {
  const { setCategory, dtCategory } = useCategory();
  // state
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // search params
  const searchParams = useSearchParams();
  const sortby = searchParams.get("sortby") || "";
  const order = searchParams.get("order") || "";
  const search = searchParams.get("cari") || "";

  const fetchDataDosen = async () => {
    await setCategory({
      page,
      search,
      sortby,
      order,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataDosen();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ketika search berubah
  useEffect(() => {
    setPage(1);
    fetchDataDosen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortby, order]);

  // table
  const headTable = ["No", "Kategori", "Aksi"];
  const tableBodies = ["category_nm"];

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col max-w-full h-full overflow-auto">
      <div className="overflow-hidden h-full flex flex-col ">
        <div className="overflow-auto grow">
          <TableDef
            headTable={headTable}
            tableBodies={tableBodies}
            dataTable={dtCategory?.data}
            page={page}
            limit={10}
            setEdit={setEdit}
            setDelete={setDelete}
          />
        </div>
        {dtCategory?.last_page > 1 && (
          <div className="mt-4">
            <PaginationDef
              currentPage={dtCategory?.current_page}
              totalPages={dtCategory?.last_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowData;
