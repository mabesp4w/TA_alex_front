/** @format */

import dynamic from "next/dynamic";
import React from "react";
const LiveClassifier = dynamic(
  () => import("@/components/prediction/LiveClassifier"),
  { ssr: false }
);

const DashboardPage: React.FC = () => {
  return (
    <main className="max-w-md mx-auto py-6 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <LiveClassifier />
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>Arahkan kamera ke daun tanaman untuk mengidentifikasi jenisnya.</p>
        <p className="mt-2">
          Model ini dapat mengenali: Daun Kemangi, Daun Kunyit, Daun Pepaya,
          Daun Sirih, Daun Sirsak, dan Lidah Buaya.
        </p>
      </div>
    </main>
  );
};

export default DashboardPage;
