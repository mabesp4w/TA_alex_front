/** @format */
"use client";
import { useWelcomeContext } from "@/context/WelcomeContext";
import React, { useEffect } from "react";

const Content = () => {
  const { setWelcome } = useWelcomeContext();
  useEffect(() => {
    setWelcome("Halaman Dashboard");

    return () => {};
  }, []);

  return <div>Selamat datang Admin</div>;
};

export default Content;
