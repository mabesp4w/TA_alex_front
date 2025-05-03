/** @format */

import MenuType from "@/types/MenuType";
import { BsBook, BsHouseDoor, BsInfoLg } from "react-icons/bs";

const adminUrl = (path: string) => `/admin${path}`;
const userUrl = (path: string) => `${path}`;

const setAdminMenus = () => {
  const ListMenu: MenuType[] = [
    {
      name: "Dashboard",
      href: adminUrl("/dashboard"),
      icon: <BsHouseDoor />,
    },
    {
      name: "Kategori",
      href: adminUrl("/categories"),
      icon: <BsInfoLg />,
    },
    {
      name: "Buku",
      href: adminUrl("/books/lists"),
      icon: <BsBook />,
    },
  ];

  return ListMenu;
};

const setUserMenus = () => {
  const ListMenu: MenuType[] = [
    {
      name: "Dashboard",
      href: userUrl("/dashboard"),
      icon: <BsHouseDoor />,
    },
    {
      name: "Kategori",
      href: userUrl("/categories"),
      icon: <BsInfoLg />,
    },
    {
      name: "Buku",
      href: userUrl("/books/lists"),
      icon: <BsBook />,
    },
  ];

  return ListMenu;
};

export { setAdminMenus, setUserMenus };
