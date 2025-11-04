'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === path;
    return pathname.startsWith(path);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (isActive(path)) {
      e.preventDefault(); // Mencegah refresh jika sudah di halaman tsb
    }
  };

  // Definisikan style Tailwind
  const baseLinkStyle = "px-3 py-2 font-medium text-secondary rounded-t-md transition-colors duration-150";
  const activeLinkStyle = "bg-primary font-semibold"; // Efek "menyatu"
  const inactiveLinkStyle = "hover:bg-gray-200";

  return (
    // Bar Navigasi (Putih)
    <nav className="flex flex-row justify-center gap-4 bg-white-custom p-2 px-4 shadow-sm">
      <Link
        href="/admin"
        className={`${baseLinkStyle} ${isActive('/admin') ? activeLinkStyle : inactiveLinkStyle}`}
        onClick={(e) => handleClick(e, '/admin')}
      >
        Dashboard
      </Link>
      <Link
        href="/admin/users"
        className={`${baseLinkStyle} ${isActive('/admin/users') ? activeLinkStyle : inactiveLinkStyle}`}
        onClick={(e) => handleClick(e, '/admin/users')}
      >
        Kelola Pengguna
      </Link>
      <Link
        href="/admin/content"
        className={`${baseLinkStyle} ${isActive('/admin/content') ? activeLinkStyle : inactiveLinkStyle}`}
        onClick={(e) => handleClick(e, '/admin/content')}
      >
        Kelola Konten
      </Link>
      <Link
        href="/"
        className={`${baseLinkStyle} ${inactiveLinkStyle}`}
      >
        Kembali ke Situs
      </Link>
    </nav>
  );
}