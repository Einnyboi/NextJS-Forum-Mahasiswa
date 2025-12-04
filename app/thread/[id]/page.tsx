'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from "@/components/features/important/navbar";
import Sidebar from "@/components/features/important/sidebar";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import { api, PostData, CommentData } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Heart, Paperclip } from 'lucide-react'; // Import Heart and Paperclip icon

export default function ThreadDetailPage() {
    const params = useParams();
    const postId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [post, setPost] = useState<PostData | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [newComment, setNewComment] = useState("");
    const [commentImage, setCommentImage] = useState(""); // NEW: Comment Image State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. Cek User
    useEffect(() => {
        // Use localStorage for consistency with other pages
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

    // Handle File Change for Comment
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCommentImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 3. Handle Submit Komentar
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        const success = await api.comments.create({
            postId: postId,
            content: newComment,
            imageUrl: commentImage, // NEW: Pass image URL
            author: user?.email || "Anonymous"
        });

        if (success) {
            setNewComment("");
            setCommentImage(""); // Reset image
            fetchData(); // Refresh komentar
        } else {
            alert("Gagal mengirim komentar.");
        }
        setSubmitting(false);
    };

    // 4. Handle Like Comment
    const handleLikeComment = async (commentId: string) => {
        if (!user?.email) return alert("Login untuk menyukai komentar.");

        const success = await api.comments.toggleLike(commentId, user.email);
        if (success) {
            fetchData(); // Refresh to show new like count/status
        }
    };

    return (
        <div>
            <Navbar onNavChange={() => { }} isLoggedIn={!!user} userRole={user?.role} />

            <div className="main-dashboard-layout">
                <Sidebar activeView="home" onMenuClick={() => { }} />

                <div className="main-content">

                    {loading ? (
                        <p className="state-message">Memuat diskusi...</p>
                    ) : post ? (
                        <>
                            {/* Back Button */}
                            <button
                                onClick={() => window.history.back()}
                                className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-2 text-muted"
                            >
                                &larr; Kembali
                            </button>

                            {/* TAMPILKAN POST UTAMA (Tidak bisa diklik lagi) */}
                            <ThreadCard thread={post} clickable={false} />

                            {/* BAGIAN KOMENTAR */}
                            <div className="mt-4 p-4 bg-white rounded-4 shadow-sm" style={{ borderRadius: '16px' }}>
                                <h4 className="fw-bold mb-4">Komentar ({comments.length})</h4>

                                {/* Form Komentar */}
                                {user ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-5">
                                        <div className="d-flex gap-3 mb-2">
                                            <div className="flex-grow-1 position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-pill px-4 pe-5" // Add padding right for icon
                                                    placeholder="Tulis balasanmu..."
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    disabled={submitting}
                                                />
                                                {/* Paperclip Icon inside Input */}
                                                <label
                                                    className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <Paperclip size={18} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-dark rounded-pill px-4"
                                                disabled={submitting || !newComment}
                                            >
                                                {submitting ? '...' : 'Kirim'}
                                            </button>
                                        </div>

                                        {/* Image Preview */}
                                        {commentImage && (
                                            <div className="ms-2 position-relative" style={{ width: 'fit-content' }}>
                                                <img src={commentImage} alt="Preview" className="mt-2 rounded" style={{ maxHeight: '100px' }} />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                                    onClick={() => setCommentImage("")}
                                                    style={{ padding: '0px 4px', fontSize: '10px', lineHeight: 1 }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                ) : (
                                    <div className="alert alert-light border mb-4 text-center">
                                        <a href="/login" className="fw-bold text-dark">Login</a> untuk ikut berdiskusi.
                                    </div>
                                )}

                                {/* List Komentar */}
                                <div className="d-flex flex-column gap-3">
                                    {comments.length > 0 ? comments.map(comment => {
                                        const isLiked = user?.email && comment.likedBy && comment.likedBy[user.email];

                                        return (
                                            <div key={comment.id} className="p-3 border-bottom">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="fw-bold text-dark small">{comment.author}</span>
                                                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Baru saja</span>
                                                </div>

                                                <p className="mb-2 text-secondary">{comment.content}</p>

                                                {/* Comment Image */}
                                                {comment.imageUrl && (
                                                    <div className="mb-2">
                                                        <img
                                                            src={comment.imageUrl}
                                                            alt="Comment attachment"
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Like Button */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <button
                                                        onClick={() => handleLikeComment(comment.id)}
                                                        className={`btn btn-sm p-0 d-flex align-items-center gap-1 ${isLiked ? 'text-success' : 'text-muted'}`}
                                                        style={{ border: 'none', background: 'none' }}
                                                    >
                                                        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                                                        <span className="small">{comment.likes || 0}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }) : (
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