/** @format */

import { FC } from "react";

type Props = {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
};

const PaginationDef: FC<Props> = ({ totalPages, currentPage, setPage }) => {
  let pages: (number | string)[] = [];

  if (totalPages <= 5) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
    pages = Array.from(new Set(pages)).sort((a: any, b: any) => a - b);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pages = pages.filter((page: number) => page > 0 && page <= totalPages);

    for (let i = 1; i < pages.length; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (pages[i] - pages[i - 1] > 1) {
        pages.splice(i, 0, "...");
        i++;
      }
    }

    if (
      pages[pages.length - 1] !== totalPages &&
      pages[pages.length - 1] !== "..."
    ) {
      pages.push("...");
      pages.push(totalPages);
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      setPage(page);
    }
  };
  return (
    <div className="h-full border-t flex justify-center items-center p-4">
      <div className="join">
        {pages.map((page: any, index: number) => (
          <button
            key={`${page}-${index}`}
            className={`join-item btn ${
              page === currentPage ? "btn-active" : ""
            } ${page === "..." ? "btn-disabled" : ""}`}
            onClick={() => typeof page === "number" && handlePageClick(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginationDef;
