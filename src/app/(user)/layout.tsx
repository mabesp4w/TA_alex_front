/** @format */

import React from "react";
import Auth from "../Auth";
import Navbar from "@/components/navbar/NabarComp";
import Footer from "@/components/footer/FooterComp";
import SettingContextProvider from "@/context/SettingContext";

type Props = {
  children: React.ReactNode;
};
const layout = ({ children }: Props) => {
  return (
    <SettingContextProvider>
      <div className="h-svh flex flex-col">
        {/* <Navbar /> */}
        <div className="flex h-full w-full border bg-base-200">{children}</div>
        {/* <Footer /> */}
        {/* <Auth /> */}
      </div>
    </SettingContextProvider>
  );
};

export default layout;
