/** @format */
"use client";
import React from "react";
import Drawer from "../other/Drawer";
import { BiMenu } from "react-icons/bi";
import { useWelcomeContext } from "@/context/WelcomeContext";

const HeaderDef = () => {
  const { welcome } = useWelcomeContext();
  return (
    <div className="w-full flex justify-center items-center">
      <h4 className="text-center text-xl font-bold">{welcome}</h4>
      <div className="w-fit lg:hidden absolute right-4 ">
        <Drawer>
          <BiMenu className="text-2xl cursor-pointer" />
        </Drawer>
      </div>
    </div>
  );
};

export default HeaderDef;
