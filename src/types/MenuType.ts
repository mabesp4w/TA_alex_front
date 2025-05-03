/** @format */

import { JSX } from "react";

interface MenuType {
  truncatedName?: string;
  name: string;
  href?: string;
  icon?: JSX.Element;
  slug?: string;
  params?: string;
  subMenus?: MenuType[];
}

export default MenuType;
