/** @format */

import Link from "next/link";
import { Leaf, Github, Mail, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-teal-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="font-bold text-xl">Herba Medica</span>
            </div>
            <p className="text-teal-100 text-sm">
              Database tanaman obat Indonesia dengan informasi lengkap tentang
              manfaat, cara penggunaan, dan visualisasi model 3D.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-teal-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/medicinal-plants"
                  className="hover:text-white transition-colors"
                >
                  Tanaman Obat
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link
                  href="/diseases"
                  className="hover:text-white transition-colors"
                >
                  Penyakit
                </Link>
              </li>
            </ul>
          </div>

          {/* Social media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <div className="space-y-3 text-teal-100">
              <a
                href="mailto:contact@herbamedica.id"
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>contact@herbamedica.id</span>
              </a>
              <a
                href="https://instagram.com/herbamedica"
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>@herbamedica</span>
              </a>
              <a
                href="https://github.com/herbamedica"
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-700 mt-8 pt-6 text-sm text-center text-teal-200">
          © {currentYear} Herba Medica. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
