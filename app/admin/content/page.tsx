'use client';

import React, { useState, useEffect } from 'react';

// Tipe data untuk sebuah thread
type Thread = {
  id: string;
  title: string;
  author: string;
  category: string;
};

export default function ManageContentPage() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    // Simulasi pengambilan data threads dari database
    const mockThreads: Thread[] = [
      { id: 't-001', title: 'Cara setup Next.js dengan Tailwind', author: 'Budi Santoso', category: 'Teknologi' },
      { id: 't-002', title: 'Review Gedung Perkuliahan Baru', author: 'Citra Lestari', category: 'Info Kampus' },
      { id: 't-003', title: 'Lowongan Magang Software Engineer', author: 'Admin Foma', category: 'Karir' },
    ];
    setThreads(mockThreads);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Halaman */}
      <h2 className="text-3xl font-bold text-secondary">
        Kelola Konten
      </h2>

      {/* Kartu Putih Utama */}
      <div className="rounded-lg bg-white-custom p-6 shadow-md">
        
        {/* Sub-header dari HTML Anda */}
        <h3 className="mb-4 text-xl font-semibold text-secondary">Manajemen Konten Threads</h3>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-left text-secondary">
            <thead>
              {/* Header Tabel dari HTML Anda */}
              <tr className="border-b-2 border-gray-200 bg-gray-50 text-gray-600">
                <th className="px-4 py-3 font-semibold">Judul Thread</th>
                <th className="px-4 py-3 font-semibold">Penulis</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop data mock ke dalam tabel */}
              {threads.map((thread) => (
                <tr key={thread.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{thread.title}</td>
                  <td className="px-4 py-3">{thread.author}</td>
                  <td className="px-4 py-3">{thread.category}</td>
                  <td>
                    {/* Tombol Aksi */}
                    <div className="flex gap-2">
                      <button className="rounded bg-blue-500 px-4 py-1 text-sm font-medium text-white hover:bg-blue-600">
                        Edit
                      </button>
                      <button className="rounded bg-error px-4 py-1 text-sm font-medium text-white hover:brightness-90">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}