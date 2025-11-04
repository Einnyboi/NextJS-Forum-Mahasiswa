import React from 'react';

// Ini adalah halaman default untuk rute '/admin'
export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Halaman: Ubah ke text-secondary (hitam) */}
      <h2 className="text-3xl font-bold text-secondary">
        Dashboard
      </h2>

      {/* Kartu Selamat Datang: Ubah ke bg-white-custom */}
      <div className="rounded-lg bg-white-custom p-6 shadow-md">
        {/* Ubah teks ke text-secondary (hitam) */}
        <h3 className="mb-4 text-xl font-semibold text-secondary">Selamat Datang, Admin!</h3>
        <p className="text-gray-600">
          Pilih menu dari navigasi di atas untuk mulai mengelola konten dan pengguna.
        </p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Kartu Stat 1: Ubah ke bg-white-custom */}
        <div className="rounded-lg bg-white-custom p-4 shadow-md">
          <h4 className="text-sm font-medium text-gray-500">Total Pengguna</h4>
          {/* Ubah angka ke text-secondary (hitam) */}
          <p className="text-3xl font-bold text-secondary">104</p>
        </div>
        
        {/* Kartu Stat 2: Ubah ke bg-white-custom */}
        <div className="rounded-lg bg-white-custom p-4 shadow-md">
          <h4 className="text-sm font-medium text-gray-500">Total Konten</h4>
          {/* Ubah angka ke text-secondary (hitam) */}
          <p className="text-3xl font-bold text-secondary">42</p>
        </div>

        {/* Kartu Stat 3: Ubah ke bg-white-custom */}
        <div className="rounded-lg bg-white-custom p-4 shadow-md">
          <h4 className="text-sm font-medium text-gray-500">Event Menunggu</h4>
          {/* Ubah angka ke text-secondary (hitam) */}
          <p className="text-3xl font-bold text-secondary">3</p>
        </div>

      </div>
    </div>
  );
}