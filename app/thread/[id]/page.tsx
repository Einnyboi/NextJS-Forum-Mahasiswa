'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import { api, PostData, CommentData } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ThreadDetailPage() {
    const params = useParams();
    const postId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [post, setPost] = useState<PostData | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. Cek User
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    // 2. Fetch Post & Comments
    const fetchData = async () => {
        setLoading(true);
        // Ambil data Post
        const postData = await api.posts.getById(postId);
        setPost(postData);

        // Ambil data Comments
        if (postData) {
            const commentData = await api.comments.getByPost(postId);
            setComments(commentData);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (postId) fetchData();
    }, [postId]);

    // 3. Handle Submit Komentar
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const success = await api.comments.create({
            postId: postId,
            content: newComment,
            author: user?.email || "Anonymous"
        });

        if (success) {
            setNewComment("");
            fetchData(); // Refresh komentar
        } else {
            alert("Gagal mengirim komentar.");
        }
        setSubmitting(false);
    };

    return (
        <div>
            <Navbar onNavChange={()=>{}} isLoggedIn={!!user} />
            
            <div className="main-dashboard-layout">
                {/* Sidebar Aktif di Home (karena ini turunan home) */}
                <Sidebar activeView="home" onMenuClick={()=>{}} />
                
                <div className="main-content">
                    
                    {loading ? (
                        <p className="state-message">Memuat diskusi...</p>
                    ) : post ? (
                        <>
                            {/* TAMPILKAN POST UTAMA (Tidak bisa diklik lagi) */}
                            <ThreadCard thread={post} clickable={false} />

                            {/* BAGIAN KOMENTAR */}
                            <div className="mt-4 p-4 bg-white rounded-4 shadow-sm" style={{borderRadius: '16px'}}>
                                <h4 className="fw-bold mb-4">Komentar ({comments.length})</h4>

                                {/* Form Komentar */}
                                {user ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-5 d-flex gap-3">
                                        <input 
                                            type="text" 
                                            className="form-control rounded-pill px-4"
                                            placeholder="Tulis balasanmu..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            disabled={submitting}
                                        />
                                        <button 
                                            type="submit" 
                                            className="btn btn-dark rounded-pill px-4"
                                            disabled={submitting || !newComment}
                                        >
                                            {submitting ? '...' : 'Kirim'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="alert alert-light border mb-4 text-center">
                                        <a href="/login" className="fw-bold text-dark">Login</a> untuk ikut berdiskusi.
                                    </div>
                                )}

                                {/* List Komentar */}
                                <div className="d-flex flex-column gap-3">
                                    {comments.length > 0 ? comments.map(comment => (
                                        <div key={comment.id} className="p-3 border-bottom">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="fw-bold text-dark small">{comment.author}</span>
                                                <span className="text-muted small" style={{fontSize: '0.75rem'}}>Baru saja</span>
                                            </div>
                                            <p className="mb-0 text-secondary">{comment.content}</p>
                                        </div>
                                    )) : (
                                        <p className="text-center text-muted small my-3">Belum ada komentar.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="state-message">Postingan tidak ditemukan.</p>
                    )}

                </div>
            </div>
        </div>
    );
}