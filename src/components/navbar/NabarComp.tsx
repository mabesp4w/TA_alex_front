/** @format */

// src/components/layout/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, User } from "lucide-react";
import NavbarMobile from "./NavbarMobile";
import useLogout from "@/stores/auth/logout";
import handleLogout from "@/app/auth/logout/logout";
import Image from "next/image";

const Navbar = () => {
  const [loadLogout, setLoadLogout] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // store
  const { setLogout } = useLogout();
  // router
  const router = useRouter();

  // Initial reader settings
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 16,
    fontFamily: "serif",
    theme: "light", // Default theme dari DaisyUI
    lineSpacing: 1.5,
    margin: 2,
  });

  // Apply theme to html element
  useEffect(() => {
    // Set the data-theme attribute on the html element
    document.documentElement.setAttribute("data-theme", readerSettings.theme);

    return () => {
      // You might want to restore the previous theme on unmount
      // This depends on your app's theme management approach
    };
  }, [readerSettings.theme]);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("readerSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setReaderSettings(parsedSettings);
      } catch (e) {
        console.error("Error parsing saved reader settings:", e);
      }
    }
  }, []);

  return (
    <div className="navbar bg-base-200 shadow-md sticky top-0 z-50 text-neutral">
      <div className="navbar-start">
        <div className="lg:hidden">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <Link href="/dashboard" className="btn btn-ghost text-xl normal-case">
          <Image src="/images/logo.png" alt="Logo" width={70} height={70} />{" "}
          Ruang Baca
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? "active" : ""}
            >
              Beranda
            </Link>
          </li>
          <li>
            <Link
              href="/buku"
              className={pathname.startsWith("/buku") ? "active" : ""}
            >
              Koleksi Buku
            </Link>
          </li>
          <li>
            <Link
              href="/kategori"
              className={pathname.startsWith("/kategori") ? "active" : ""}
            >
              Kategori
            </Link>
          </li>
          <li>
            <Link
              href="/koleksi-saya"
              className={pathname.startsWith("/koleksi-saya") ? "active" : ""}
            >
              Koleksi Saya
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className={`${isSearchOpen ? "flex" : "hidden md:flex"} mr-2`}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Cari buku..."
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
        </div>
        <button
          className="btn btn-ghost btn-circle md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search size={20} />
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <button className="btn btn-circle btn-ghost">
                <User size={20} />
              </button>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/profil">Profil</Link>
            </li>
            <li>
              <Link href="/pengaturan">Pengaturan</Link>
            </li>
            {loadLogout ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <li>
                <Link
                  href="#"
                  onClick={() =>
                    handleLogout({ setLogout, setLoadLogout, router })
                  }
                >
                  Keluar
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <NavbarMobile
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setLogout={setLogout}
        router={router}
        setLoadLogout={setLoadLogout}
        loadLogout={loadLogout}
      />
    </div>
  );
};

export default Navbar;
