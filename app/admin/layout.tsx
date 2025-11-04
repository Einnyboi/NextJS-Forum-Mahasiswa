import React from 'react';
import AdminNav from './adminNav';
export const metadata = {
  title: 'Admin Foma',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER UTAMA (Dua Tingkat) */}
      <header className="w-full shadow-md">
        
        {/* Tingkat 1: Bar "Admin Foma" (Gelap) */}
        <div className="bg-secondary p-4 px-6">
          <h1 className="text-2xl font-bold text-white-custom">
            Admin Foma
          </h1>
        </div>

        {/* Tingkat 2: Bar Navigasi (Putih) */}
        <AdminNav />

      </header>

      {/* KONTEN UTAMA (bg-primary sudah dari body) */}
      <main className="flex-grow p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}