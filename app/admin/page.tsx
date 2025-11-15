import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Ini adalah halaman default untuk rute '/admin'
export default function AdminDashboardPage() {
  return (
    // 'py-2' adalah padding atas/bawah ringan dari Bootstrap
    <div className="py-2">
      
      {/* Header Halaman (Bootstrap) */}
      <h2 className="h2 fw-bold mb-4">
        Dashboard
      </h2>

      {/* Kartu Selamat Datang (Bootstrap 'card') */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h3 className="h5 fw-semibold mb-3">Selamat Datang, Admin!</h3>
          <p className="text-muted">
            Pilih menu dari navigasi di atas untuk mulai mengelola konten dan pengguna.
          </p>
        </div>
      </div>

      {/* Grid Kartu Statistik (Bootstrap 'row' dan 'col') */}
      <div className="row g-4">
        
        {/* Kartu Stat 1 */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-muted h6">Total Pengguna</h4>
              <p className="card-text h3 fw-bold">104</p>
            </div>
          </div>
        </div>
        
        {/* Kartu Stat 2 */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-muted h6">Total Konten</h4>
              <p className="card-text h3 fw-bold">42</p>
            </div>
          </div>
        </div>

        {/* Kartu Stat 3 */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-muted h6">Event Menunggu</h4>
              <p className="card-text h3 fw-bold">3</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}