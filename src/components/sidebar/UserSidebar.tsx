/** @format */
"use client";
// src/components/layout/Sidebar.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Bookmark,
  Layers,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  Book,
} from "lucide-react";
import { usePathname } from "next/navigation";

const UserSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Deteksi layar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set pada awal load
    checkIsMobile();

    // Update ketika resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Jika mobile, selalu collapsed
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const menuItems = [
    { icon: <Home size={20} />, label: "Beranda", path: "/dashboard" },
    { icon: <Book size={20} />, label: "Buku", path: "/buku" },
    {
      icon: <BookOpen size={20} />,
      label: "Dibaca",
      path: "/sedang-dibaca",
    },
    {
      icon: <Layers size={20} />,
      label: "Koleksi",
      path: "/koleksi-saya",
    },
    { icon: <Bookmark size={20} />, label: "Bookmark", path: "/bookmark" },
    { icon: <Highlighter size={20} />, label: "Anotasi", path: "/anotasi" },
  ];

  if (isMobile && pathname.startsWith("/buku/") && pathname.includes("/baca")) {
    // Jangan tampilkan sidebar pada halaman pembaca di mobile
    return null;
  }

  return (
    <div
      className={`
      ${
        isMobile
          ? "bottom-0 fixed w-full z-40"
          : "hidden md:block bg-base-200 shadow-lg transition-all duration-300"
      } 
      ${isCollapsed && !isMobile ? "w-16" : "w-64"}
    `}
    >
      {isMobile ? (
        // Mobile: bottom navigation
        <div className="btm-nav bg-neutral-content shadow-t">
          {menuItems.slice(0, 5).map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={
                pathname === item.path ? "bg-neutral text-neutral-content" : ""
              }
            >
              {item.icon}
              <span className="btm-nav-label text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      ) : (
        // Desktop: sidebar
        <div className="flex flex-col h-full justify-between">
          <div className="p-4">
            <button
              className="btn btn-ghost btn-sm w-full flex justify-end"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>

            <ul className="menu menu-md mt-4 px-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={`${pathname === item.path ? "active" : ""} ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4">
            {!isCollapsed && (
              <div className="bg-primary/10 p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Aktivitas Terbaru</h4>
                <p className="text-xs opacity-80">
                  Lanjutkan membaca Filosofi Teras
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
