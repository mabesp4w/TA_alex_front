/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Leaf,
  Grid,
  FlaskConical,
  Search,
  HeartPulse,
} from "lucide-react";
import { useState } from "react";

export default function BottomNavigation() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cek apakah halaman aktif untuk styling
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Search overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-t-xl p-4 absolute bottom-16 left-0 right-0 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Pencarian</h3>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => setIsSearchOpen(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form action="/medicinal-plants" method="GET">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Cari tanaman obat, kategori, penyakit..."
                  className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
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

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="submit"
                  formAction="/medicinal-plants"
                  className="flex flex-col items-center justify-center bg-teal-50 p-3 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <Leaf className="h-5 w-5 text-teal-600 mb-1" />
                  <span className="text-xs font-medium text-teal-800">
                    Tanaman
                  </span>
                </button>

                <button
                  type="submit"
                  formAction="/categories"
                  className="flex flex-col items-center justify-center bg-teal-50 p-3 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <Grid className="h-5 w-5 text-teal-600 mb-1" />
                  <span className="text-xs font-medium text-teal-800">
                    Kategori
                  </span>
                </button>

                <button
                  type="submit"
                  formAction="/diseases"
                  className="flex flex-col items-center justify-center bg-red-50 p-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <FlaskConical className="h-5 w-5 text-red-600 mb-1" />
                  <span className="text-xs font-medium text-red-800">
                    Penyakit
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-3 flex-1 ${
              isActive("/") ? "text-teal-600" : "text-gray-600"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Beranda</span>
          </Link>

          <Link
            href="/medicinal-plants"
            className={`flex flex-col items-center justify-center py-3 flex-1 ${
              isActive("/medicinal-plants") ? "text-teal-600" : "text-gray-600"
            }`}
          >
            <Leaf className="h-6 w-6" />
            <span className="text-xs mt-1">Tanaman</span>
          </Link>

          <Link
            href="/prediction"
            className="flex flex-col items-center justify-center py-3 flex-1 text-gray-600"
          >
            <div className="bg-teal-600 rounded-full p-3 -mt-5 shadow-lg">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1">Deteksi</span>
          </Link>

          <Link
            href="/categories"
            className={`flex flex-col items-center justify-center py-3 flex-1 ${
              isActive("/categories") ? "text-teal-600" : "text-gray-600"
            }`}
          >
            <Grid className="h-6 w-6" />
            <span className="text-xs mt-1">Kategori</span>
          </Link>

          <Link
            href="/diseases"
            className={`flex flex-col items-center justify-center py-3 flex-1 ${
              isActive("/diseases") ? "text-red-600" : "text-gray-600"
            }`}
          >
            <FlaskConical className="h-6 w-6" />
            <span className="text-xs mt-1">Penyakit</span>
          </Link>
        </div>
      </div>
    </>
  );
}
