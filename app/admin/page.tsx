'use client';
import React, { useEffect, useState } from 'react';
import { api, PostData } from '@/lib/api';
import { User } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingEvents: 0
  });
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [postActivityData, setPostActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to format date to Month Name
  const getMonthName = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleString('default', { month: 'short' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, posts] = await Promise.all([
          api.admin.getAllUsers(),
          api.posts.getAll()
        ]);

        const users = usersData as User[];

        const pendingEvents = posts.filter(post => post.category === 'event').length;

        setStats({
          totalUsers: users.length,
          totalPosts: posts.length,
          pendingEvents
        });

        // --- Process User Growth Data ---
        const today = new Date();
        const chartDataUsers = [];

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = d.toLocaleString('default', { month: 'short' });

          // Calculate users who joined up to the end of this month
          // We use a simplified logic: count users whose joinDate is before the next month
          const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

          const usersUntilThisMonth = users.filter(u => {
            if (!u.joinDate) return false;
            const joinDate = new Date(u.joinDate);
            return joinDate < nextMonth;
          }).length;

          chartDataUsers.push({
            name: monthName,
            users: usersUntilThisMonth
          });
        }
        setUserGrowthData(chartDataUsers);


        // --- Process Post Activity Data ---
        const postsPerMonth: Record<string, { posts: number, events: number }> = {};

        // Initialize last 6 months keys
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = d.toLocaleString('default', { month: 'short' });
          postsPerMonth[monthName] = { posts: 0, events: 0 };
        }

        posts.forEach(p => {
          // Use createdAt if available, otherwise fallback to date string
          const dateStr = p.createdAt ? (p.createdAt.toDate ? p.createdAt.toDate().toISOString() : p.createdAt) : p.date;
          const m = getMonthName(dateStr);

          if (postsPerMonth[m]) {
            if (p.category === 'event') {
              postsPerMonth[m].events++;
            } else {
              postsPerMonth[m].posts++;
            }
          }
        });

        const finalPostData = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = d.toLocaleString('default', { month: 'short' });
          finalPostData.push({
            name: monthName,
            posts: postsPerMonth[monthName]?.posts || 0,
            events: postsPerMonth[monthName]?.events || 0
          });
        }
        setPostActivityData(finalPostData);

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
                Gunakan panel ini untuk mengatur forum dan memastikan semuanya berjalan lancar.
              </p>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-dark btn-sm rounded-pill px-4 shadow-sm">
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
                  <p className="card-text h1 fw-bold text-dark mb-0">
                    {loading ? '...' : stats.totalUsers}
                  </p>
                </div>
                <div className="bg-light rounded-circle p-3 text-dark">
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

      {/* Charts Section */}
      <div className="row mt-4">
        {/* User Growth Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Pertumbuhan Pengguna (6 Bulan Terakhir)</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Post Activity Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Aktivitas Postingan (6 Bulan Terakhir)</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={postActivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" name="Postingan" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="events" name="Event" fill="#ffc658" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}