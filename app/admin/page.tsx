'use client';
import React from 'react';
// Kita tidak butuh Link atau usePathname lagi di sini karena Navigasi sudah di Layout

export default function AdminDashboardPage() {
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
                {/* Hiasan atau tombol aksi cepat */}
                <button className="btn btn-primary btn-sm rounded-pill px-4">
                  Lihat Laporan
                </button>
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
                    <p className="card-text h1 fw-bold text-dark mb-0">104</p>
                 </div>
                 <div className="bg-light rounded-circle p-2 text-primary">
                    {/* Icon placeholder (User) */}
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
                    <p className="card-text h1 fw-bold text-dark mb-0">42</p>
                 </div>
                 <div className="bg-light rounded-circle p-2 text-success">
                    {/* Icon placeholder (File) */}
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
                    <h4 className="card-title text-muted small text-uppercase fw-bold mb-1">Event Menunggu</h4>
                    <p className="card-text h1 fw-bold text-dark mb-0">3</p>
                 </div>
                 <div className="bg-light rounded-circle p-2 text-warning">
                    {/* Icon placeholder (Calendar) */}
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                 </div>
              </div>
              <p className="small text-danger mt-3 mb-0">
                Butuh persetujuan segera
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}