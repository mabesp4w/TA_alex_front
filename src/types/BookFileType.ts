/** @format */

import { BookType } from "./BookType";

// bookFile
export type BookFileType = {
  id: string;
  file_type: string;
  file_book: string;
  is_original: boolean;
  book_id: string;
  book: BookType;
};
