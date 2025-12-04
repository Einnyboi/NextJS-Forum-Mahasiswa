'use client';
import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { api } from '@/lib/api';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.admin.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Gagal ambil data, gunakan dummy:", error);
        // Data Dummy jika API kosong/error
        setUsers([
          { id: '1', fullName: 'Budi Santoso', email: 'budi@test.com', role: 'user' },
          { id: '2', fullName: 'Admin Foma', email: 'admin@foma.com', role: 'admin' },
          { id: '3', fullName: 'Siti Aminah', email: 'siti@test.com', role: 'user' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h2 className="h2 fw-bold mb-4">Kelola Pengguna</h2>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title as="h5" className="mb-4 text-muted">Daftar Pengguna Aktif</Card.Title>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="dark" />
            </div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th className="py-3">ID</th>
                  <th className="py-3">Nama Lengkap</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Peran</th>
                  <th className="py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="fw-medium">{user.fullName || user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {/* Badge Role */}
                      <Badge
                        bg={user.role === 'admin' ? 'dark' : 'secondary'}
                        className="px-3 py-2 rounded-pill fw-normal"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      {/* --- TOMBOL DISAMAKAN DENGAN KONTEN --- */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-3"
                      >
                        Hapus
                      </Button>
                      {/* -------------------------------------- */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
}