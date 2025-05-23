/** @format */

import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const layout = ({ children }: Props) => {
  return <Suspense>{children}</Suspense>;
};

export default layout;
