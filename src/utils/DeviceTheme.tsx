/** @format */
"use client";
import { useEffect } from "react";

const DeviceTheme = () => {
  useEffect(() => {
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const root = window.document.documentElement;

    if (userPrefersDark) {
      root.setAttribute("data-theme", "forest"); // Atur tema ke "forest"
      root.classList.add("dark"); // Tambahkan class untuk Tailwind
    } else {
      root.setAttribute("data-theme", "pastel"); // Atur tema ke "light"
      root.classList.remove("dark"); // Hapus class dark
    }
  }, []);

  return null;
};

export default DeviceTheme;
