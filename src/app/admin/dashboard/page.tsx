/** @format */

import React, { Suspense } from "react";
import Content from "./Content";

const Dashboard = () => {
  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    </section>
  );
};

export default Dashboard;
