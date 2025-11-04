'use client'; // Wajib untuk useState/useEffect

import React, { useState, useEffect } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulasi data
    const mockUsers: User[] = [
      { id: 101, name: 'Budi Santoso', email: 'budi.s@example.com', role: 'User' },
      { id: 102, name: 'Citra Lestari', email: 'citra.l@example.com', role: 'User' },
      { id: 103, name: 'Admin Foma', email: 'admin@foma.com', role: 'Admin' },
      { id: 104, name: 'Doni Saputra', email: 'doni.s@example.com', role: 'User' },
    ];
    setUsers(mockUsers);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Halaman: Ubah ke text-secondary (hitam) */}
      <h2 className="text-3xl font-bold text-secondary">
        Kelola Pengguna
      </h2>

      {/* Card Putih Utama: Ubah ke bg-white-custom */}
      <div className="rounded-lg bg-white-custom p-6 shadow-md">
        
        {/* Sub-header: Ubah ke text-secondary (hitam) */}
        <h3 className="mb-4 text-xl font-semibold text-secondary">Daftar Pengguna Aktif</h3>

        {/* Tabel */}
        <div className="overflow-x-auto">
          {/* Pastikan teks tabel defaultnya hitam (text-secondary) */}
          <table className="w-full min-w-full text-left text-secondary">
            <thead>
              {/* Header Tabel: Buat abu-abu muda */}
              <tr className="border-b-2 border-gray-200 bg-gray-50 text-gray-600">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Peran</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td>
                    {/* Tombol Aksi (Gaya Tailwind) */}
                    <div className="flex gap-2">
                      <button className="rounded bg-blue-500 px-4 py-1 text-sm font-medium text-white hover:bg-blue-600">
                        Edit
                      </button>
                      {/* Tombol Hapus: Gunakan bg-error */}
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