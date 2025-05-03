/** @format */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { setAdminMenus } from "./ListMenus";
import MenuType from "@/types/MenuType";
import Link from "next/link";
import Image from "next/image";
// import Cookies from "js-cookie";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import handleLogout from "@/app/auth/logout/logout";
import useLogout from "@/stores/auth/logout";

const Sidebar = () => {
  // state
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loadLogout, setLoadLogout] = useState(false);
  // const role = Cookies.get("role");
  const role = "admin";
  // store
  const { setLogout } = useLogout();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isActiveLink = (href: string, params?: string) => {
    if (!href) return false;
    if (params) {
      return pathname === href && searchParams.toString() === params.slice(1);
    }
    return pathname === href;
  };

  const isActiveParent = (menu: MenuType) => {
    if (!menu.subMenus) return false;
    return menu.subMenus.some((subMenu) =>
      isActiveLink(subMenu?.href || "", subMenu.params)
    );
  };

  const getListMenu = useCallback(() => {
    if (role === "admin") {
      setMenus(setAdminMenus());
    }
  }, [role]);

  useEffect(() => {
    getListMenu();
  }, [getListMenu]);

  if (menus.length === 0) {
    return (
      <div className="fixed h-full flex w-56 justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <aside className="bg-base-200 h-full flex flex-col w-56">
      {/* image */}
      <div className="relative h-32 w-40 mx-auto">
        <Image src="/images/logo.png" alt="logo" fill className="" />
      </div>
      <ul className="menu p-4 text-lg rounded-box h-full overflow-auto block">
        {menus.map((menu, index) => (
          <li key={index}>
            {menu.subMenus ? (
              <details open={isActiveParent(menu)}>
                <summary className="flex items-center gap-2">
                  {menu.icon}
                  {menu.name}
                </summary>
                <ul>
                  {menu.subMenus.map((subMenu, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={`${subMenu.href}${subMenu.params || ""}`}
                        className={
                          isActiveLink(subMenu?.href || "", subMenu.params)
                            ? "active"
                            : ""
                        }
                      >
                        {subMenu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                href={menu.href || "#"}
                className={`flex items-center gap-2 ${
                  isActiveLink(menu?.href || "") ? "active" : ""
                }`}
              >
                {menu.icon}
                {menu.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
      {loadLogout ? (
        <span className="loading loading-spinner loading-lg text-primary"></span>
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => handleLogout({ setLogout, setLoadLogout, router })}
        >
          Logout
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
