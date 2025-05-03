/** @format */
"use client";

import { useMenuContext } from "@/context/MenuContext";
import React, { FC, ReactNode, useEffect, useRef } from "react";
import Sidebar from "../sidebar/Sidebar";
import { usePathname } from "next/navigation";

type DrawerProps = {
  children: ReactNode;
};

const Drawer: FC<DrawerProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useMenuContext();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLLabelElement>(null);
  // pathname
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // close if pathname change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <div className="drawer z-50">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />

      <div className="drawer-content">
        <label ref={toggleButtonRef} htmlFor="my-drawer">
          {children}
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsOpen(false)}
        />
        <div
          ref={sidebarRef}
          className="flex gap-x-4 min-h-screen fixed h-full"
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Drawer;
