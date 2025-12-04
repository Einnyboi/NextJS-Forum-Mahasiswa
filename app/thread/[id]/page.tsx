'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import { api, PostData, CommentData } from "@/lib/api";
import { Heart, Paperclip } from 'lucide-react';

export default function ThreadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [post, setPost] = useState<PostData | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [newComment, setNewComment] = useState("");
    const [commentImage, setCommentImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. Cek User
    useEffect(() => {
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
            imageUrl: commentImage,
            author: user?.fullName || user?.email || "Anonymous"
        });

        if (success) {
            setNewComment("");
            setCommentImage("");
            fetchData();
        } else {
            alert("Failed to post comment.");
        }
        setSubmitting(false);
    };

    // 4. Handle Like Comment
    const handleLikeComment = async (commentId: string) => {
        if (!user?.email) return alert("Login to like comments.");

        const success = await api.comments.toggleLike(commentId, user.email);
        if (success) {
            fetchData();
        }
    };

    return (
        <div>
            <Navbar onNavChange={() => { }} isLoggedIn={!!user} userRole={user?.role} userName={user?.fullName} />

            <div className="main-dashboard-layout">
                <Sidebar activeView="home" onMenuClick={() => { }} />

                <div className="main-content">

                    {loading ? (
                        <p className="state-message">Loading discussion...</p>
                    ) : post ? (
                        <div className="right-panel-card">
                            {/* Back Button & Header */}
                            <div className="d-flex align-items-center mb-4 gap-3">
                                <div className="bg-light p-2 rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', cursor: 'pointer' }}>
                                    <button
                                        onClick={() => {
                                            if (post.communityId) {
                                                router.push(`/community/${post.communityId}`);
                                            } else {
                                                router.push('/community');
                                            }
                                        }}
                                        className="btn btn-link text-decoration-none p-0 d-flex align-items-center justify-content-center text-dark"
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <span className="fw-bold fs-5">&lt;</span>
                                    </button>
                                </div>
                                <h2 className="m-0 fw-bold fs-4 text-dark">Threads</h2>
                            </div>

                            {/* TAMPILKAN POST UTAMA */}
                            <div className="mb-4">
                                <ThreadCard
                                    thread={post}
                                    clickable={false}
                                    commentCount={comments.length}
                                />
                            </div>

                            {/* BAGIAN KOMENTAR */}
                            <div className="mt-4">
                                <h4 className="fw-bold mb-4">Comments ({comments.length})</h4>

                                {/* Form Komentar */}
                                {user ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-5">
                                        <div className="d-flex gap-3 mb-2">
                                            <div className="flex-grow-1 position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-pill px-4 pe-5"
                                                    placeholder="Write your reply..."
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
                                                {submitting ? '...' : 'Post'}
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
                                        <a href="/login" className="fw-bold text-dark">Login</a> to join the discussion.
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
                                                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Just now</span>
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
                                        <p className="text-center text-muted small my-3">No comments yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="state-message">Post not found.</p>
                    )}

                </div>
            </div>
        </div>
    );
}