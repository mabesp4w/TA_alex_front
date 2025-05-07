/** @format */

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import LiveClassifier with SSR disabled
const LiveClassifier = dynamic(
  () => import("@/components/prediction/LiveClassifier"),
  { ssr: false }
);

const DashboardPage: React.FC = () => {
  return (
    <main className="w-full h-screen overflow-hidden">
      <LiveClassifier />
    </main>
  );
};

export default DashboardPage;
