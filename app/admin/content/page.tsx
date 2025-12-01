'use client'; 
import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { api, PostData } from '@/lib/api'; // Import API dan Tipe Data

export default function ManageContentPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Data Real
  const fetchPosts = async () => {
    setLoading(true);
    const data = await api.posts.getAll();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fungsi Delete Real
  const handleDelete = async (postId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
        const success = await api.posts.delete(postId);
        if (success) {
            // Hapus dari state lokal agar UI update tanpa refresh
            setPosts(posts.filter(p => p.id !== postId));
            alert("Postingan berhasil dihapus.");
        } else {
            alert("Gagal menghapus postingan.");
        }
    }
  };

  return (
    <div>
      <h2 className="h2 fw-bold mb-4">Kelola Konten</h2>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Card.Title as="h5" className="mb-4 text-muted">Manajemen Konten Threads</Card.Title>
          
          {loading ? (
             <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
             </div>
          ) : posts.length === 0 ? (
             <p className="text-center py-4">Tidak ada konten yang ditemukan.</p>
          ) : (
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
                {posts.map((post) => (
                    <tr key={post.id}>
                    <td className="fw-medium">{post.title}</td>
                    <td>{post.author}</td>
                    <td>
                        <span className={`badge border text-dark ${post.category === 'community' ? 'bg-info-subtle' : 'bg-warning-subtle'}`}>
                            {post.category}
                        </span>
                    </td>
                    <td>
                        <Button variant="outline-dark" size="sm" className="me-2 rounded-pill px-3">
                            Lihat
                        </Button>
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="rounded-pill px-3"
                            onClick={() => handleDelete(post.id)}
                        >
                            Hapus
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
          )}

        </Card.Body>
      </Card>
    </div>
  );
}