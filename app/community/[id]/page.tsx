'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
// Import Komponen ThreadCard yang baru kita buat
import { ThreadCard } from "@/components/features/thread/ThreadCard"; 
import { api, PostData } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

// --- KOMPONEN MODAL CREATE POST (Khusus Komunitas) ---
interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void; 
    userEmail: string;
    communityId: string; // ID Komunitas wajib ada
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, userEmail, communityId }: CreateModalProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simpan post dengan communityId yang spesifik
        const success = await api.posts.create({
            title,
            content,
            author: userEmail || "Anonymous",
            category: 'community', 
            communityId: communityId, // PENTING: Agar tidak nyasar ke home/komunitas lain
            date: new Date().toLocaleDateString('id-ID'),
            createdAt: new Date()
        });

        setIsSubmitting(false);
        if (success) {
            setTitle(""); setContent(""); 
            onSubmit(); // Refresh list
            onClose();
        } else {
            alert("Gagal memposting.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Buat Diskusi Baru</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Judul Topik</label>
                        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Isi Diskusi</label>
                        <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Memposting..." : "Posting"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- HALAMAN UTAMA ---
export default function CommunityDetailPage() {
    const params = useParams();
    const communityId = params.id as string; // Contoh: 'teknologi'

    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Cek User Login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    // 2. Fetch Data (Hanya milik komunitas ini)
    const fetchPosts = async () => {
        setLoading(true);
        const data = await api.posts.getByCommunity(communityId);
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        if (communityId) fetchPosts();
    }, [communityId]);

    return (
        <div>
            <Navbar onNavChange={()=>{}} isLoggedIn={!!user} />
            
            <div className="main-dashboard-layout">
                {/* Sidebar aktif di menu 'community' */}
                <Sidebar activeView="community" onMenuClick={()=>{}} />
                
                <div className="main-content">
                    
                    {/* Header Komunitas */}
                    <div className="welcome-banner d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="welcome-title text-capitalize">
                                Forum {communityId}
                            </h2>
                            <p className="welcome-text mb-0">
                                Ruang diskusi untuk topik {communityId}.
                            </p>
                        </div>
                        {user ? (
                            <button className="btn-create-test mt-0" onClick={() => setIsModalOpen(true)}>
                                + Buat Diskusi
                            </button>
                        ) : (
                            <span className="text-muted small">Login untuk memposting</span>
                        )}
                    </div>

                    {/* Modal Popup */}
                    <CreatePostModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onSubmit={fetchPosts} 
                        userEmail={user?.email}
                        communityId={communityId}
                    />

                    {/* List Threads */}
                    {loading ? (
                        <p className="state-message">Memuat diskusi...</p>
                    ) : posts.length > 0 ? (
                        <div className="mt-4">
                            {posts.map(post => (
                                // MENGGUNAKAN KOMPONEN THREAD CARD DI SINI
                                <ThreadCard key={post.id} thread={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="state-message">
                            <p>Belum ada diskusi di komunitas ini.</p>
                            <p className="small">Jadilah yang pertama memulai topik!</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}