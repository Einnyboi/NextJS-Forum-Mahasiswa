'use client'; 
import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { api, PostData } from '@/lib/api'; 

export default function ManageContentPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  const fetchPosts = async () => {
    setLoading(true);
    const data = await api.posts.getAll();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. Hapus
  const handleDelete = async (postId: string) => {
    if (confirm("Yakin ingin menghapus postingan ini secara permanen?")) {
        const success = await api.posts.delete(postId);
        if (success) {
            setPosts(posts.filter(p => p.id !== postId)); 
        } else {
            alert("Gagal menghapus.");
        }
    }
  };

  // 3. Hide/Show (Sekarang Aman karena API sudah diperbaiki)
  const handleToggle = async (post: PostData) => {
      const currentStatus = post.isVisible !== false; 
      const success = await api.posts.toggleVisibility(post.id, currentStatus);
      
      if (success) {
          setPosts(posts.map(p => 
              p.id === post.id ? { ...p, isVisible: !currentStatus } : p
          ));
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
                <Spinner animation="border" variant="dark" />
             </div>
          ) : posts.length === 0 ? (
             <p className="text-center py-4 text-muted">Belum ada konten postingan.</p>
          ) : (
            <Table hover responsive className="align-middle">
                <thead className="table-light">
                <tr>
                    <th className="py-3">Status</th>
                    <th className="py-3">Judul Thread</th>
                    <th className="py-3">Penulis</th>
                    <th className="py-3">Kategori</th>
                    <th className="py-3">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {posts.map((post) => (
                    <tr key={post.id} style={{ opacity: post.isVisible === false ? 0.5 : 1 }}>
                    <td>
                        {post.isVisible !== false ? (
                            <Badge bg="success" className="rounded-pill fw-normal px-3">Aktif</Badge>
                        ) : (
                            <Badge bg="secondary" className="rounded-pill fw-normal px-3">Hidden</Badge>
                        )}
                    </td>
                    <td className="fw-medium">{post.title}</td>
                    <td>{post.author}</td>
                    <td>
                        <span className={`badge border text-dark fw-normal rounded-pill px-3 ${post.category === 'community' ? 'bg-info-subtle' : 'bg-warning-subtle'}`}>
                            {post.category}
                        </span>
                    </td>
                    <td>
                        {/* Tombol Toggle */}
                        <Button 
                            variant={post.isVisible !== false ? "outline-warning" : "outline-success"}
                            size="sm" 
                            className="me-2 rounded-pill px-3"
                            onClick={() => handleToggle(post)}
                        >
                            {post.isVisible !== false ? "Hide" : "Show"}
                        </Button>

                        {/* Tombol Hapus */}
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