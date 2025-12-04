'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import Navbar from "@/components/features/important/navbar";
import Sidebar from "@/components/features/important/sidebar";
import SignupForm from "./signup/page";
import LoginForm from "./Login/page";
import { api, PostData } from "@/lib/api";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import { CommunityHeroCarousel } from "@/components/features/home/CommunityHeroCarousel";
import CreateCommunityForm from "@/components/features/community/CreateCommunityForm";

// --- KOMPONEN FEED UTAMA (POSTS) ---
const HomeContent = ({ user }: { user: any }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch Data Postingan dan Komunitas
  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsData, communitiesData] = await Promise.all([
        api.posts.getAll(),
        api.communities.getAll()
      ]);
      setPosts(postsData);
      // Ambil semua komunitas untuk carousel
      setCommunities(communitiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <CommunityHeroCarousel communities={communities} />

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
  const router = useRouter();
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
        } else {
          // clear user if no session
          setUser(null);
        }
      } catch (error) {
        console.error("Error reading session:", error);
        setUser(null);
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
    if (currentView === 'login') return <LoginForm onLoginSuccess={() => {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        setUser({
          email: session.email,
          role: session.role,
          fullName: session.fullName
        });
      }
      setCurrentView('home');
    }} />;

    if (authLoading) return <div className="p-5 text-center text-muted">Sedang memuat...</div>;

    return <HomeContent user={user} />;
  };

  return (
    <div>
      <Navbar
        onNavChange={handleNavChange}
        isLoggedIn={!!user}
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
