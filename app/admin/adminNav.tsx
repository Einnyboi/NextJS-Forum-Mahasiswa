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
      e.preventDefault(); // Mencegah refresh
    }
  };

  return (
    /* FIX: Kelas 'justify-content-center' akan memusatkan semua link.
      'nav-pills' memberikan efek 'box' biru pada link yang aktif.
      'bg-light' memberikan background abu-abu muda pada bar navigasi.
    */
    <nav className="nav nav-pills justify-content-center bg-light p-2 shadow-sm">
      
      <Link
        href="/admin"
        // 'nav-link' adalah kelas link Bootstrap
        // 'active' akan ditambahkan secara otomatis jika link aktif
        className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
        onClick={(e) => handleClick(e, '/admin')}
      >
        Dashboard
      </Link>
      
      <Link
        href="/admin/users"
        className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
        onClick={(e) => handleClick(e, '/admin/users')}
      >
        Kelola Pengguna
      </Link>
      
      <Link
        href="/admin/content"
        className={`nav-link ${isActive('/admin/content') ? 'active' : ''}`}
        onClick={(e) => handleClick(e, '/admin/content')}
      >
        Kelola Konten
      </Link>
      
      <Link
        href="/"
        className="nav-link" // Link "Kembali" tidak perlu status aktif
      >
        Kembali ke Situs
      </Link>

    </nav>
  );
}