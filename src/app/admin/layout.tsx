/** @format */

import HeaderDef from "@/components/header/HeaderDef";
import MenuContextProvider from "@/context/MenuContext";
import WelcomeContextProvider from "@/context/WelcomeContext";
import React, { Suspense } from "react";
import Auth from "../Auth";
import Sidebar from "@/components/sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <WelcomeContextProvider>
      <MenuContextProvider>
        <section className="flex gap-x-4 min-h-screen">
          <div className="z-10 hidden lg:block lg:fixed h-full">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
          </div>
          <div className="lg:ml-56 w-full bg-base-100 flex flex-col">
            <div className="h-10 w-full shadow-xl mb-2 flex items-center">
              <Suspense fallback={<div>Loading...</div>}>
                <HeaderDef />
              </Suspense>
            </div>
            <div className="px-4 h-full">{children}</div>
          </div>
        </section>
        <Auth />
      </MenuContextProvider>
    </WelcomeContextProvider>
  );
};

export default layout;
