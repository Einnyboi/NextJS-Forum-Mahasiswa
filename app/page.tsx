'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
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
      // Ambil 4 komunitas teratas untuk preview
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

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    if (communities.length === 0) return;

    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % Math.min(communities.length, 3));
    }, 3000);

    return () => clearInterval(interval);
  }, [communities]);

  const topCommunities = communities.slice(0, 3);
  const currentCommunity = topCommunities[currentCarouselIndex];

  return (
    <div>
      <div className="hero-card">
        {/* Search Bar removed as requested */}

        <div className="hero-content">
          <h2 className="hero-title">
            Discuss with People<br />Over The World
          </h2>
          <p className="hero-subtitle">
            Bagikan ide atau acara terbaru kepada teman-temanmu.
          </p>

          <div className="community-pills-container">
            {/* Popular pill removed as requested */}
            {communities.slice(0, 4).map(comm => (
              <div
                key={comm.id}
                className="community-pill"
                onClick={() => router.push(`/community/${comm.id}`)}
              >
                {comm.name}
              </div>
            ))}
          </div>

          {/* Explore Button moved below as requested */}
          <div style={{ marginTop: '1rem' }}>
            <div
              className="community-pill active"
              onClick={() => router.push('/community')}
            >
              Explore &rarr;
            </div>
          </div>
        </div>

        {/* Hero Carousel - Auto Rotating */}
        <div className="hero-carousel-container">
          {currentCommunity && (
            <div
              className="hero-carousel-card"
              onClick={() => router.push(`/community/${currentCommunity.id}`)}
            >
              <div className="carousel-text-content">
                <h3 className="carousel-community-name">{currentCommunity.name}</h3>
                <p className="carousel-community-desc">
                  {(currentCommunity.description?.length || 0) > 50
                    ? currentCommunity.description.substring(0, 50) + '...'
                    : (currentCommunity.description || 'No description available')}
                </p>
                <div className="carousel-stats">
                  {currentCommunity.members?.length || 0} Members
                </div>
              </div>
              <div
                className="carousel-community-image"
                style={{ backgroundImage: `url(${currentCommunity.imageUrl || 'https://via.placeholder.com/150'})` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className="state-message">Memuat postingan...</p>
      ) : posts.length > 0 ? (
        <div className="d-flex flex-column gap-2">
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
