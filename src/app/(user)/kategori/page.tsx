/** @format */
"use client";
// src/app/kategori/page.tsx
import Link from "next/link";
import { Book, ChevronRight } from "lucide-react";
import UserSidebar from "@/components/sidebar/UserSidebar";
import useCategoryApi from "@/stores/api/Category";
import { useCallback, useEffect } from "react";

export default function CategoriesPage() {
  const { setCategory, dtCategory } = useCategoryApi();

  // get set book
  const getData = useCallback(async () => {
    await setCategory();
  }, [setCategory]);

  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Kategori Buku</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dtCategory.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.id}`}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="card-body p-4">
                <h3 className="card-title">{category.category_nm}</h3>
                <div className="flex items-center gap-1 text-sm opacity-70">
                  <Book size={16} />
                  <span>{category.book_count} buku</span>
                </div>
                <div className="card-actions justify-end mt-2">
                  <ChevronRight size={16} className="text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
