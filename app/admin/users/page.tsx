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
    // Simulasi data (ini tidak berubah)
    const mockUsers: User[] = [
      { id: 101, name: 'Budi Santoso', email: 'budi.s@example.com', role: 'User' },
      { id: 102, name: 'Citra Lestari', email: 'citra.l@example.com', role: 'User' },
      { id: 103, name: 'Admin Foma', email: 'admin@foma.com', role: 'Admin' },
      { id: 104, name: 'Doni Saputra', email: 'doni.s@example.com', role: 'User' },
    ];
    setUsers(mockUsers);
  }, []);

  return (
    // Ganti 'flex flex-col gap-6' dengan padding Bootstrap
    <div className="py-2">
      
      {/* Header Halaman (Bootstrap) */}
      <h2 className="h2 fw-bold mb-4">
        Kelola Pengguna
      </h2>

      {/* Ganti 'rounded-lg bg-white-custom...' dengan 'card' Bootstrap */}
      <div className="card shadow-sm p-4">
        
        {/* Sub-header (Bootstrap) */}
        <h3 className="h5 fw-semibold mb-3">Daftar Pengguna Aktif</h3>

        {/* Tabel (Bootstrap) */}
        <div className="table-responsive">
          {/* Tambahkan kelas 'table' dan 'table-hover' */}
          <table className="table table-hover align-middle">
            <thead>
              {/* Header Tabel (Bootstrap) */}
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nama</th>
                <th scope="col">Email</th>
                <th scope="col">Peran</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {/* Tombol Aksi (Gaya Bootstrap) */}
                    {/* Ganti 'flex gap-2' dengan 'gap-2' Bootstrap */}
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm">
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm">
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