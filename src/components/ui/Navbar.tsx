/** @format */

import Link from "next/link";
import { Leaf, Search, Grid, FlaskConical, Home } from "lucide-react";

export default function Navbar() {
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

          {/* Search icon */}
          <div className="flex md:hidden">
            <button className="p-2 rounded-full hover:bg-teal-700">
              <Search className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile navigation menu button */}
          <div className="md:hidden">
            <button className="flex items-center p-2" id="mobile-menu-button">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu (hidden by default) */}
        <div className="hidden md:hidden" id="mobile-menu">
          <div className="flex flex-col space-y-4 pb-4">
            <Link
              href="/"
              className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-teal-700"
            >
              <Home className="h-5 w-5" />
              <span>Beranda</span>
            </Link>
            <Link
              href="/medicinal-plants"
              className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-teal-700"
            >
              <Leaf className="h-5 w-5" />
              <span>Tanaman Obat</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-teal-700"
            >
              <Grid className="h-5 w-5" />
              <span>Kategori</span>
            </Link>
            <Link
              href="/diseases"
              className="flex items-center space-x-2 px-2 py-2 rounded hover:bg-teal-700"
            >
              <FlaskConical className="h-5 w-5" />
              <span>Penyakit</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
