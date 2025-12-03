'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import SignupForm from "./signup/page";
import LoginForm from "./Login/page";
import { api, PostData } from "@/lib/api";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import CreateCommunityForm from "@/components/features/community/CreateCommunityForm";

// --- KOMPONEN FEED UTAMA (POSTS) ---
const HomeContent = ({ user }: { user: any }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  // Fetch Data Postingan
  const fetchPosts = async () => {
    setLoading(true);
    const data = await api.posts.getAll();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="welcome-banner mb-4">
        <h2 className="welcome-title">Home Feed</h2>
        <p className="welcome-text">
          Welcome back! Bagikan ide atau acara terbaru kepada teman-temanmu.
        </p>

        {/* Tombol Buat Komunitas */}
        {user ? (
          <button className="btn-create-test" onClick={() => setIsCommunityModalOpen(true)}>
            + Buat Komunitas Baru
          </button>
        ) : (
          <p className="text-sm text-red-500 mt-2 font-medium">Login untuk membuat komunitas.</p>
        )}
      </div>

      <CreateCommunityForm
        show={isCommunityModalOpen}
        onHide={() => setIsCommunityModalOpen(false)}
        onSuccess={() => {
          alert("Komunitas berhasil dibuat!");
        }}
      />

      {loading ? (
        <p className="state-message">Memuat postingan...</p>
      ) : posts.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {/* List Postingan */}
          {posts.map(post => (
            <ThreadCard key={post.id} thread={post} />
          ))}
        </div>
      ) : (
        <div className="state-message">
          <p>Belum ada postingan.</p>
          <p className="small">Jadilah yang pertama memposting di komunitas!</p>
        </div>
      )}
    </div>
  );
};

// --- MAIN HOME ---
export default function Home() {
  const router = useRouter(); // Initialize router
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cek Login dari localStorage
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.isLoggedIn) {
            setUser({
              email: session.email,
              role: session.role,
              fullName: session.fullName
            });
          }
        }
      } catch (error) {
        console.error("Error reading session:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUserSession();
    window.addEventListener('storage', checkUserSession);
    return () => window.removeEventListener('storage', checkUserSession);
  }, []);

  // Handle Navigation
  const handleNavChange = (view: string) => {
    if (view === 'community') {
      router.push('/community');
    } else {
      setCurrentView(view);
    }
  };

  const renderMainContent = () => {
    if (currentView === 'signup') return <SignupForm />;
    if (currentView === 'login') return <LoginForm />;

    if (authLoading) return <div className="p-5 text-center text-muted">Sedang memuat...</div>;

    return <HomeContent user={user} />;
  };

  return (
    <div>
      <Navbar
        onNavChange={handleNavChange}
        isLoggedIn={!!user}
        userRole={user?.role}
      />

      <div className="main-container">
        <div className="main-dashboard-layout">
          <Sidebar activeView={currentView} onMenuClick={(view) => router.push(view === 'home' ? '/' : `/${view}`)} />

          <div className="main-content">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  )
}