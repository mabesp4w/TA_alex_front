/** @format */

import { BookType } from "./BookType";

// category
export type CategoryType = {
  id: string;
  category_nm: string;
  read_count?: number;
  book_count?: number;
  books: BookType[];
};
