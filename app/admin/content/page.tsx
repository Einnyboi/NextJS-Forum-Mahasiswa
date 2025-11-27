'use client'; 
import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';

// Data dummy sesuai screenshot Anda
const dummyThreads = [
  { id: 1, title: 'Cara setup Next.js dengan Tailwind', author: 'Budi Santoso', category: 'Teknologi' },
  { id: 2, title: 'Review Gedung Perkuliahan Baru', author: 'Citra Lestari', category: 'Info Kampus' },
  { id: 3, title: 'Lowongan Magang Software Engineer', author: 'Admin Foma', category: 'Karir' },
];

export default function ManageContentPage() {
  return (
    <div>
      {/* Judul Halaman */}
      <h2 className="h2 fw-bold mb-4">Kelola Konten</h2>

      {/* --- BUNGKUS DENGAN CARD (CONTAINER PUTIH) --- */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          
          <Card.Title as="h5" className="mb-4 text-muted">Manajemen Konten Threads</Card.Title>
          
          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-3">Judul Thread</th>
                <th className="py-3">Penulis</th>
                <th className="py-3">Kategori</th>
                <th className="py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyThreads.map((thread) => (
                <tr key={thread.id}>
                  <td className="fw-medium">{thread.title}</td>
                  <td>{thread.author}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                        {thread.category}
                    </span>
                  </td>
                  <td>
                    <Button variant="outline-dark" size="sm" className="me-2 rounded-pill px-3">
                        Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" className="rounded-pill px-3">
                        Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

        </Card.Body>
      </Card>
      {/* --- AKHIR CARD --- */}
      
    </div>
  );
}