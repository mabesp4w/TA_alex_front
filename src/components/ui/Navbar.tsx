/** @format */

"use client";

import Link from "next/link";
import { Leaf, Search, Grid, FlaskConical, Home } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="font-bold text-xl">Herba Medica</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-1 hover:text-teal-200 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Beranda</span>
            </Link>
            <Link
              href="/medicinal-plants"
              className="flex items-center space-x-1 hover:text-teal-200 transition-colors"
            >
              <Leaf className="h-5 w-5" />
              <span>Tanaman Obat</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center space-x-1 hover:text-teal-200 transition-colors"
            >
              <Grid className="h-5 w-5" />
              <span>Kategori</span>
            </Link>
            <Link
              href="/diseases"
              className="flex items-center space-x-1 hover:text-teal-200 transition-colors"
            >
              <FlaskConical className="h-5 w-5" />
              <span>Penyakit</span>
            </Link>
          </div>

          {/* Search icon on mobile */}
          <div className="flex md:hidden">
            <button
              className="p-2 rounded-full hover:bg-teal-700"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile search box */}
        {isSearchOpen && (
          <div className="md:hidden py-4 pb-6 animate-fade-in">
            <form action="/medicinal-plants" method="GET">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Cari tanaman obat..."
                  className="w-full px-4 py-2 pl-10 pr-12 border border-teal-400 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 bg-teal-50 text-gray-800"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600">
                  <Search className="h-5 w-5" />
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white rounded-full p-1 hover:bg-teal-600 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
