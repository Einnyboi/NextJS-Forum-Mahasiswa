'use client';
import React, { useEffect, useState } from 'react';
import { api, PostData } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, posts] = await Promise.all([
          api.admin.getAllUsers(),
          api.posts.getAll()
        ]);

        const pendingEvents = posts.filter(post => post.category === 'event').length;

        setStats({
          totalUsers: users.length,
          totalPosts: posts.length,
          pendingEvents
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Header Halaman */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h2 fw-bold mb-0">Dashboard Overview</h2>
        <span className="text-muted small">Update terakhir: Hari ini</span>
      </div>

      {/* Kartu Selamat Datang */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="h5 fw-semibold mb-2">Selamat Datang kembali, Admin!</h3>
              <p className="text-muted mb-0">
                Anda sedang menggunakan tampilan <strong>Navbar Horizontal</strong>.
                Gunakan menu di bagian atas untuk berpindah halaman.
              </p>
            </div>
            <div className="col-md-4 text-end">
              {/* --- UPDATE TOMBOL DI SINI --- */}
              {/* Menggunakan btn-dark (Hitam Solid) atau btn-outline-dark agar senada */}
              <button className="btn btn-dark btn-sm rounded-pill px-4 shadow-sm">
                Lihat Laporan
              </button>
              {/* ----------------------------- */}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="row g-4">

        {/* Kartu 1 */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="card-title text-muted small text-uppercase fw-bold mb-1">Total Pengguna</h4>
                  <p className="card-text h1 fw-bold text-dark mb-0">
                    {loading ? '...' : stats.totalUsers}
                  </p>
                </div>
                <div className="bg-light rounded-circle p-3 text-dark">
                  {/* Icon User */}
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
              </div>
              <p className="small text-success mt-3 mb-0">
                <span className="fw-bold">↑ 12%</span> dari bulan lalu
              </p>
            </div>
          </div>
        </div>

        {/* Kartu 2 */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="card-title text-muted small text-uppercase fw-bold mb-1">Total Postingan</h4>
                  <p className="card-text h1 fw-bold text-dark mb-0">
                    {loading ? '...' : stats.totalPosts}
                  </p>
                </div>
                <div className="bg-light rounded-circle p-3 text-dark">
                  {/* Icon File */}
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
              </div>
              <p className="small text-muted mt-3 mb-0">
                Aktif minggu ini
              </p>
            </div>
          </div>
        </div>

        {/* Kartu 3 */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="card-title text-muted small text-uppercase fw-bold mb-1">Total Event</h4>
                  <p className="card-text h1 fw-bold text-dark mb-0">
                    {loading ? '...' : stats.pendingEvents}
                  </p>
                </div>
                <div className="bg-light rounded-circle p-3 text-danger">
                  {/* Icon Calendar */}
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>
              <p className="small text-danger mt-3 mb-0">
                Terjadwal
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}