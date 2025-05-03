/** @format */

// src/app/kategori/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Book, Search } from "lucide-react";
import BookGrid from "@/components/book/BookGrid";
import UserSidebar from "@/components/sidebar/UserSidebar";
import useCategoryApi from "@/stores/api/Category";

export default function CategoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  // store
  const { setShowCategory, showCategory } = useCategoryApi();

  useEffect(() => {
    setShowCategory(id);
  }, [id, setShowCategory]);

  console.log({ showCategory });

  // Filter buku berdasarkan pencarian
  useEffect(() => {
    if (showCategory) {
      const filtered = showCategory.books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, showCategory]);

  return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-4">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link href="/">Beranda</Link>
              </li>
              <li>
                <Link href="/kategori">Kategori</Link>
              </li>
              <li>{showCategory && showCategory.category_nm}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Book size={24} className="text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Kategori: {showCategory && showCategory.category_nm}
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              {showCategory && showCategory.books.length} buku dalam kategori
              ini
            </p>
          </div>
        </div>

        <div className="form-control mb-6">
          <div className="input-group">
            <input
              type="text"
              placeholder="Cari buku dalam kategori..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-square">
              <Search size={18} />
            </button>
          </div>
        </div>

        <BookGrid
          books={filteredBooks}
          emptyMessage="Tidak ada buku dalam kategori ini."
          header={
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Daftar Buku ({showCategory && showCategory.books.length})
              </h2>
              <div className="flex gap-2 items-center">
                <span className="text-sm">Urutkan:</span>
                <select className="select select-bordered select-sm">
                  <option value="title_asc">Judul (A-Z)</option>
                  <option value="title_desc">Judul (Z-A)</option>
                  <option value="author">Penulis</option>
                  <option value="year_desc">Tahun (Terbaru)</option>
                  <option value="year_asc">Tahun (Terlama)</option>
                </select>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
