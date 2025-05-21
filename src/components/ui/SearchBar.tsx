/** @format */

import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchBar({
  placeholder = "Cari tanaman obat...",
  onSubmit,
}: SearchBarProps) {
  // Catatan: Dalam implementasi sebenarnya, kita akan menggunakan
  // form action untuk server components atau metode lain untuk menangani pencarian

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-primary"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-1 hover:bg-teal-700 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
