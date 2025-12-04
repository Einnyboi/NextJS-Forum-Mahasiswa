'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditProfileForm from '@/components/features/profile/EditProfileForm';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';

export default function UserDetailsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sessionData = localStorage.getItem('userSession');
      if (!sessionData) {
        router.push('/login');
        return;
      }
      
      const session = JSON.parse(sessionData);
      const userId = session?.id || session?.uid || session?.userId;
      
      if (!userId) {
        setError('Invalid user data');
        setLoading(false);
        return;
      }

      // Fetch user data
      fetch(`/api/profile?id=${encodeURIComponent(userId)}`)
        .then(res => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data.user);
          }
        })
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
    } catch (e) {
      setError('Failed to read user session');
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!user) return <div className="p-4">No user data available.</div>;

  return (
    <div>
      <Navbar 
        onNavChange={(view) => {
          if (view === 'home') router.push('/');
          else if (view === 'community') router.push('/community');
        }}
        isLoggedIn={true}
      />

      <div className="main-dashboard-layout">
        <Sidebar activeView="profile" onMenuClick={(view) => {
          if (view === 'home') router.push('/');
          else if (view === 'community') router.push('/community');
          else if (view === 'profile') router.push('/profile');
        }} />

        <div className="main-content">
          <div className="edit-profile-container">
            <h1 className="page-title">Edit Your Profile</h1>
            <EditProfileForm user={user} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .edit-profile-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0c120c;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
}