'use client'
import { useState, useEffect } from 'react';
import ProfileClient from '@/components/features/profile/ProfileClient';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUserSession = () => {
      try {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.isLoggedIn) {
            setUser(session);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error reading session:", error);
        setUser(null);
      }
    };

    checkUserSession();
    window.addEventListener('storage', checkUserSession);
    return () => window.removeEventListener('storage', checkUserSession);
  }, []);

  const handleNavChange = () => {
    // Profile page doesn't need to handle nav changes
  };

  return (
    <div>
      <Navbar 
        onNavChange={handleNavChange}
        isLoggedIn={!!user}
      />
      
      <div className="main-container hide-scrollbar">
        <div className="main-dashboard-layout">
          <Sidebar />
          
          <div className="main-content">
            <ProfileClient />
          </div>
        </div>
      </div>
    </div>
  );
}