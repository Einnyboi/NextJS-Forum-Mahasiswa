import React from 'react';
import AdminNav from './adminNav'; // File ini juga harus ditulis ulang
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ini akan ada di layout utama

export const metadata = {
  title: 'Admin Foma',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Ini adalah kelas-kelas Bootstrap
    <div className="d-flex flex-column min-vh-100">
      <header className="w-100 shadow-sm">
        <div className="bg-dark p-3 px-4">
          <h1 className="h2 fw-bold text-light">
            Admin Foma
          </h1>
        </div>
        <AdminNav />
      </header>
      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  );
}