'use client'

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import SignupForm from "./signup/page";
import LoginForm from "./Login/page";
// Firebase & API Imports
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; 
import { api, PostData } from "@/lib/api";

// --- KOMPONEN MODAL CREATE POST ---
interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void; 
    userEmail: string;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, userEmail }: CreateModalProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("community");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await api.posts.create({
            title,
            content,
            author: userEmail || "Anonymous",
            category: category as 'community' | 'event',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date()
        });

        setIsSubmitting(false);

        if (success) {
            setTitle("");
            setContent("");
            setCategory("community");
            onSubmit(); 
            onClose();
        } else {
            alert("Gagal membuat postingan. Coba lagi.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Buat Postingan Baru</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Judul</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Apa topik diskusinya?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Kategori</label>
                        <select 
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="community">Community (Diskusi)</option>
                            <option value="event">Event (Acara)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Isi Konten</label>
                        <textarea 
                            className="form-textarea" 
                            placeholder="Tulis detail lengkap di sini..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Batal
                        </button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Memposting..." : "Posting Sekarang"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- KOMPONEN KARTU THREAD (REUSABLE) ---
const ThreadCard = ({ thread }: { thread: PostData }) => (
  <div className="thread-card">
    <div className="thread-header">
      <div className="author-info">
        <div className="author-avatar">
            {thread.author ? thread.author.charAt(0) : 'A'}
        </div>
        <span className="author-name">{thread.author}</span>
      </div>
      <span className="post-date">{thread.date}</span>
    </div>
    
    <h3 className="thread-title">{thread.title}</h3>
    <p className="thread-content">{thread.content}</p>
    
    <div className="thread-footer">
      <span className={`category-badge ${thread.category}`}>
        {thread.category === 'community' ? 'Community' : 'Event'}
      </span>
    </div>
  </div>
);

// --- KOMPONEN FEED UTAMA ---
const FeedContent = ({ view, user }: { view: string, user: any }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Data dari Firestore
  const fetchPosts = async () => {
    setLoading(true);
    const data = await api.posts.getAll();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter Data
  const filteredThreads = posts.filter(thread => {
    if (view === 'home') return true; 
    return thread.category === view;
  });

  const getTitle = () => {
      if (view === 'community') return 'Community Discussions';
      if (view === 'event') return 'Upcoming Events';
      return 'Home Feed';
  }

  return (
    <div>
      <div className="welcome-banner">
        <h2 className="welcome-title">{getTitle()}</h2>
        <p className="welcome-text">
          Welcome back{user?.email ? `, ${user.email}` : ''}! 
          Bagikan ide atau acara terbaru kepada teman-temanmu.
        </p>
        
        {/* Tombol Buat Postingan */}
        {user ? (
            <button className="btn-create-test" onClick={() => setIsModalOpen(true)}>
                + Buat Postingan Baru
            </button>
        ) : (
            <p className="text-sm text-red-500 mt-2 font-medium">Login untuk membuat postingan.</p>
        )}
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={fetchPosts} 
        userEmail={user?.email}
      />

      {loading ? (
          <p className="state-message">Memuat postingan...</p>
      ) : filteredThreads.length > 0 ? (
        filteredThreads.map(thread => (
          <ThreadCard key={thread.id} thread={thread} />
        ))
      ) : (
        <p className="state-message">
            Belum ada postingan di kategori ini. Jadilah yang pertama!
        </p>
      )}
    </div>
  );
};

// --- MAIN HOME ---
export default function Home() {
    const [currentView, setCurrentView] = useState('home');
    const [user, setUser] = useState<any>(null);
    // Kita tetap butuh state ini, tapi tidak dipakai untuk memblokir layar
    const [authLoading, setAuthLoading] = useState(true); 

    // Cek Login Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const docRef = doc(db, "users", firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    let role = 'user';
                    
                    // --- LOGIKA PEMBEDA ADMIN VS USER ---
                    if (docSnap.exists()) {
                        role = docSnap.data().role || 'user';
                    }
                    // ------------------------------------

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        role: role
                    });
                } catch (error) {
                    console.error("Error:", error);
                }
            } else {
                setUser(null);
            }
            setAuthLoading(false); // Data selesai dimuat
        });
        return () => unsubscribe();
    }, []);

    // --- BAGIAN YANG DIHAPUS ---
    // if (authLoading) { return <div...>Loading...</div> }
    // ---------------------------

    const renderMainContent = () => {
        if (currentView === 'signup') return <SignupForm />;
        if (currentView === 'login') return <LoginForm />;
        
        // Opsional: Tampilkan loading kecil hanya di bagian feed, bukan seluruh layar
        if (authLoading) {
             return <div className="p-5 text-center text-muted">Sedang memuat data akun...</div>;
        }

        return <FeedContent view={currentView} user={user} />;
    };

    return (
      <div>
          <Navbar 
            onNavChange={setCurrentView} 
            isLoggedIn={!!user} 
            userRole={user?.role} // Ini kunci pembeda tampilan Admin
          />
          
          <div className="main-container">
              <div className="main-dashboard-layout">
                <Sidebar activeView={currentView} onMenuClick={setCurrentView} />
                
                <div className="main-content">
                    {renderMainContent()}
                </div>
              </div>
          </div>
      </div>
    )
}