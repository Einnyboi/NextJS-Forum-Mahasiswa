'use client'; 
import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { api } from '@/lib/api'; 

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.admin.getAllUsers(); 
        setUsers(data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        // Fallback ke data kosong atau dummy jika API belum siap
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="mb-4">Kelola Pengguna</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title as="h5" className="mb-3">Daftar Pengguna Aktif</Card.Title>
          {loading ? (
             <p>Loading data...</p>
          ) : (
            <Table striped hover responsive>
                {/* ... (Header Tabel) ... */}
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName || user.username}</td>
                    <td>{user.email}</td>
                    <td>
                        {/* Logika Badge Role */}
                        <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>
                            {user.role}
                        </Badge>
                    </td>
                    <td>
                        <Button variant="primary" size="sm" className="me-2">Edit</Button>
                        <Button variant="danger" size="sm">Hapus</Button>
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