/** @format */

"use client";

import handleLogout from "@/app/auth/logout/logout";
import {
  Book,
  Bookmark,
  BookOpen,
  Highlighter,
  Home,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";
import { BiCategory, BiCollection } from "react-icons/bi";

type Props = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLogout: () => Promise<{ status: string; data?: any; error?: any }>;
  router: any;
  setLoadLogout: React.Dispatch<React.SetStateAction<boolean>>;
  loadLogout: boolean;
};
const NavbarMobile = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setLogout,
  router,
  setLoadLogout,
  loadLogout,
}: Props) => {
  // pathname
  const pathname = usePathname();
  const user = JSON.parse(Cookies.get("user") || "{}");
  return (
    <div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-base-100 overflow-y-auto">
          <div className="flex flex-col">
            <div className="flex justify-end">
              <button
                className="btn btn-ghost btn-circle self-end"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center text-3xl">
                    <User size={48} />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold">{user.first_name}</h2>
            </div>

            <div className="divider my-4"></div>

            <ul className="menu w-full">
              <li>
                <Link
                  href="/dashboard"
                  className={pathname === "/dashboard" ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home size={20} /> Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/buku"
                  className={pathname.startsWith("/buku") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Book size={20} /> Koleksi Buku
                </Link>
              </li>
              <li>
                <Link
                  href="/kategori"
                  className={pathname.startsWith("/kategori") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BiCategory size={20} /> Kategori
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksi-saya"
                  className={
                    pathname.startsWith("/koleksi-saya") ? "active" : ""
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BiCollection size={20} /> Koleksi Saya
                </Link>
              </li>
              <li>
                <Link
                  href="/sedang-dibaca"
                  className={
                    pathname.startsWith("/sedang-dibaca") ? "active" : ""
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen size={20} /> Sedang Dibaca
                </Link>
              </li>
              <li>
                <Link
                  href="/bookmark"
                  className={pathname.startsWith("/bookmark") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bookmark size={20} /> Bookmark
                </Link>
              </li>
              <li>
                <Link
                  href="/anotasi"
                  className={pathname.startsWith("/anotasi") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Highlighter size={20} /> Anotasi
                </Link>
              </li>
            </ul>

            <div className="divider my-4"></div>

            <ul className="menu w-full">
              <li>
                <Link
                  href="/profil"
                  className={pathname.startsWith("/profil") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} /> Profil
                </Link>
              </li>
              <li>
                <Link
                  href="/pengaturan"
                  className={pathname.startsWith("/pengaturan") ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={20} /> Pengaturan
                </Link>
              </li>
              {loadLogout ? (
                <li>
                  <span className="loading loading-spinner text-primary"></span>
                </li>
              ) : (
                <li>
                  <Link
                    href="#"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout({ setLogout, setLoadLogout, router });
                    }}
                  >
                    <LogOut size={20} /> Keluar
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
