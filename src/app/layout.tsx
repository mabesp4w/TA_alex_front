/** @format */

import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BottomNavigation from "@/components/ui/BottomNavigation";

export const metadata = {
  title: "Medicinal Plants Database",
  description: "Database of medicinal plants with 3D models and information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 md:pb-8 pb-24 h-full">
            {children}
          </main>
          <Footer className="hidden md:block" />
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
